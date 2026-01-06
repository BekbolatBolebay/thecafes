import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { RoleProvider } from '../contexts/RoleContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const MainLayout = () => {
  const { authState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (authState.authenticated === null) {
      // Still loading
      return;
    }

    if (authState.authenticated && !inTabsGroup) {
      // User is signed in but not in the main tab group.
      // Redirect them to the main screen.
      router.replace('/(tabs)/orders');
    } else if (!authState.authenticated && inTabsGroup) {
      // User is not signed in and is trying to access a protected screen.
      // Redirect them to the login screen.
      router.replace('/login');
    }
  }, [authState.authenticated, segments]);

  if (authState.authenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RoleProvider>
        <MainLayout />
      </RoleProvider>
    </AuthProvider>
  );
}