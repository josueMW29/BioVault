import { Stack } from 'expo-router';
import { VaultProvider } from '../src/context/VaultContext';
import { theme } from '../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <VaultProvider>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style="light" />
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background }
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/biometric" options={{ animation: 'fade' }} />
          <Stack.Screen name="(protected)" options={{ animation: 'fade' }} />
        </Stack>
      </View>
    </VaultProvider>
  );
}
