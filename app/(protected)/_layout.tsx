import { Stack, Redirect } from 'expo-router';
import { useVault } from '../../src/context/VaultContext';
import { theme } from '../../src/constants/theme';
import { TouchableOpacity } from 'react-native';
import { Settings, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProtectedLayout() {
  const { isUnlocked, lock } = useVault();
  const router = useRouter();

  if (!isUnlocked) {
    return <Redirect href="/(auth)/biometric" />;
  }

  return (
    <Stack 
      screenOptions={{ 
        contentStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="home" 
        options={{ 
          title: 'Mi Bóveda',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/settings')}
              style={{ marginRight: theme.spacing.md }}
            >
              <Settings color={theme.colors.text} size={24} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => {
                lock();
                router.replace('/(auth)/biometric');
              }}
              style={{ marginLeft: theme.spacing.md }}
            >
              <Lock color={theme.colors.danger} size={24} />
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen name="media-viewer" options={{ title: 'Visor', presentation: 'fullScreenModal' }} />
      <Stack.Screen name="document-viewer" options={{ title: 'Documento', presentation: 'modal' }} />
    </Stack>
  );
}
