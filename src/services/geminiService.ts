import { requireSupabase } from '../supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function friendlyUnavailableMessage(language: string) {
  if (language === 'en') {
    return 'Rusdi AI is temporarily busy. Please wait a moment and try again.';
  }
  return 'Rusdi AI sedang sibuk sementara. Mohon tunggu sebentar dan coba lagi.';
}

export async function askGemini(
  message: string,
  sessionId: string,
  attachment?: { base64: string; mimeType: string; name: string },
  language = 'id'
): Promise<string> {
  const authHeaders: Record<string, string> = {};
  try {
    const { data } = await requireSupabase().auth.getSession();
    if (data.session?.access_token) {
      authHeaders.Authorization = `Bearer ${data.session.access_token}`;
    }
  } catch (err) {
    console.error('[gemini-frontend] Failed to get auth session:', err);
  }

  const payload: Record<string, unknown> = {
    message,
    sessionId,
    conversationId: sessionId,
    language
  };
  if (attachment) {
    payload.inlineData = {
      data: attachment.base64,
      mimeType: attachment.mimeType,
      name: attachment.name
    };
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/rusdi/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(payload)
    });
  } catch (networkError) {
    console.error('[gemini-frontend] Network error:', networkError);
    throw new Error('Tidak dapat terhubung ke server AI. Periksa koneksi internet Anda.');
  }

  const errorData = await response.json().catch(() => ({} as Record<string, unknown>));

  if (!response.ok) {
    const errorMessage = String(errorData.error || errorData.message || 'Gagal terhubung dengan asisten hukum AI');
    const errorCode = String(errorData.code || '');
    console.error('[gemini-frontend] API error:', { status: response.status, code: errorCode, message: errorMessage });

    if (errorCode === 'GEMINI_QUOTA' || response.status === 429) {
      throw new Error(errorMessage);
    }
    if (errorCode === 'GEMINI_NO_KEY') {
      throw new Error('AI belum dikonfigurasi. Hubungi administrator untuk mengaktifkan GEMINI_API_KEY.');
    }
    if (errorCode === 'GEMINI_UNAVAILABLE' || response.status === 503) {
      throw new Error(friendlyUnavailableMessage(language));
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    }
    throw new Error(errorMessage);
  }

  const data = errorData as { response?: string };
  if (!data.response) {
    throw new Error('Gagal mendapatkan jawaban dari AI');
  }
  return data.response;
}
