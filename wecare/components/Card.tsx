import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CardProps {
  title: string;
  description?: string;
  href: string;
  storageKey: string;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ title, description, href, storageKey, style }) => {
  const handlePress = async () => {
    try {
      const current = await AsyncStorage.getItem(storageKey);
      const next = current ? parseInt(current, 10) + 1 : 1;
      await AsyncStorage.setItem(storageKey, String(next));
    } catch (e) {
      // ignore storage errors
    }
  };

  return (
    <Link href={href} asChild>
      <Pressable onPress={handlePress} style={[styles.card, style]}
        accessibilityRole="button">
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default Card;
