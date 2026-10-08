import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock, FileX } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'lock' | 'empty';
}

export const EmptyState = ({ title, description, icon = 'empty' }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon === 'lock' ? (
          <Lock size={48} color={theme.colors.primary} />
        ) : (
          <FileX size={48} color={theme.colors.textSecondary} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  }
});
