import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './src/lib/supabaseClient';
import './global.css';

const Stack = createNativeStackNavigator();

// Temporary stub screens
const SplashScreen = () => (
  <View className="flex-1 items-center justify-center bg-brand-black">
    <ActivityIndicator size="large" color="#ffffff" />
    <Text className="text-white mt-4 font-bold text-lg">FINPROSE</Text>
  </View>
);

const AuthScreen = () => (
  <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-brand-black font-bold text-2xl">Login to FINPROSE</Text>
  </View>
);

const MainScreen = () => (
  <View className="flex-1 items-center justify-center bg-brand-gray-50">
    <Text className="text-brand-black font-bold text-xl">FINPROSE Mobile Dashboard</Text>
  </View>
);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setSession(session as any);
      setLoading(false);
    });

    const authListener = supabase?.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session as any);
    });

    return () => {
      authListener?.data.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator id="root" screenOptions={{ headerShown: false }}>
          {session ? (
            <Stack.Screen name="Main" component={MainScreen} />
          ) : (
            <Stack.Screen name="Auth" component={AuthScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
