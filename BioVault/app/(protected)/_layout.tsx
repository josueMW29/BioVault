import { Stack, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useVault } from '../../src/context/VaultContext';

export default function ProtectedLayout() {
  const { isUnlocked, lockVault } = useVault();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isUnlocked) {
      router.replace('/(auth)/biometric');
    }
  }, [isUnlocked]);

  // Bloqueo automático al pasar a segundo plano
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        lockVault(); // Bloquear inmediatamente al ir a segundo plano
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!isUnlocked) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}
