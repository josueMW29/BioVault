import { Stack } from 'expo-router';
import { VaultProvider } from '../src/context/VaultContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <VaultProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F172A' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(protected)" options={{ animation: 'fade' }} />
      </Stack>
    </VaultProvider>
  );
}
