import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { theme } from '../constants/theme';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const AppButton = ({ 
  title, 
  variant = 'primary', 
  icon, 
  loading, 
  style, 
  disabled, 
  ...props 
}: AppButtonProps) => {
  
  const getBackgroundColor = () => {
    if (variant === 'outline') return 'transparent';
    if (variant === 'danger') return theme.colors.danger;
    if (variant === 'secondary') return theme.colors.surface;
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.colors.text;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outline,
        (disabled || loading) && styles.disabled,
        style
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text style={[styles.text, { color: getTextColor(), marginLeft: icon ? 8 : 0 }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
    minHeight: 52,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disabled: {
    opacity: 0.6,
  }
});
