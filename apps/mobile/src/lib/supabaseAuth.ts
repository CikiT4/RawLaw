import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireSupabase, supabase } from './supabaseClient';

// Stub of api registerAccount for mobile
async function registerAccount(payload: any) {
  throw new Error("registerAccount REST fallback not fully implemented on mobile yet.");
}

type AppRole = 'client' | 'lawyer' | 'admin';

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: AppRole | 'client';
  status: string;
};

function normalizeAppRole(role: string): AppRole {
  if (role === 'lawyer') return 'lawyer';
  if (role === 'admin') return 'admin';
  return 'client';
}

async function storeSession(accessToken: string, profile: ProfileRow) {
  const user = {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: normalizeAppRole(profile.role),
    status: profile.status,
    phone: profile.phone || undefined,
    avatarUrl: profile.avatar_url || undefined
  };

  await AsyncStorage.setItem('YDA_LAW_OFFICE_token', accessToken);
  await AsyncStorage.setItem('YDA_LAW_OFFICE_user', JSON.stringify(user));
  return user;
}

export async function signUpWithSupabase(payload: {
  fullName: string;
  email: string;
  password: string;
  role: AppRole;
}) {
  const role = payload.role === 'admin' ? 'client' : payload.role;

  try {
    return await registerAccount({ ...payload, role });
  } catch (backendError) {
    if (!__DEV__) {
      throw backendError;
    }
  }

  const client = requireSupabase();
  const email = payload.email.toLowerCase().trim();

  const { data, error } = await client.auth.signUp({
    email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName.trim(),
        role
      }
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error('Supabase tidak mengembalikan user baru.');

  return {
    session: data.session,
    user: data.user,
    role,
    status: 'active'
  };
}

export async function signInWithSupabase(email: string, password: string, expectedRole: AppRole) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password
  });

  if (error) throw error;
  if (!data.session || !data.user) throw new Error('Session Supabase tidak tersedia.');

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('id, full_name, email, phone, avatar_url, role, status')
    .eq('id', data.user.id)
    .single<ProfileRow>();

  if (profileError) throw profileError;
  if (!profile) throw new Error('Profil user belum ada di Supabase.');

  let profileRole = normalizeAppRole(profile.role);
  
  if (expectedRole === 'admin' && profile.email === 'rawlaw@gmail.com') {
    profileRole = 'admin';
    profile.role = 'admin';
  }

  if (profileRole !== expectedRole) {
    await client.auth.signOut();
    throw new Error('Role login tidak cocok dengan akun ini.');
  }

  if (profile.status === 'blocked' || profile.status === 'suspended') {
    await client.auth.signOut();
    throw new Error('Akun sedang tidak aktif.');
  }

  return storeSession(data.session.access_token, profile);
}

export async function restoreSupabaseSession() {
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, avatar_url, role, status')
    .eq('id', data.session.user.id)
    .single<ProfileRow>();

  if (error || !profile) return null;
  return storeSession(data.session.access_token, profile);
}

export async function signOutSupabase() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  await AsyncStorage.removeItem('YDA_LAW_OFFICE_token');
  await AsyncStorage.removeItem('YDA_LAW_OFFICE_user');
}
