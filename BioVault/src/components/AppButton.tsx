import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  icon?: string;
}

export default function AppButton({ title, onPress, variant = 'primary', style }: Props) {
  const bgColor = variant === 'primary' ? theme.colors.primary : variant === 'danger' ? theme.colors.danger : theme.colors.surface;
  const textColor = variant === 'secondary' ? theme.colors.text : '#FFF';

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: bgColor }, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  }
});
