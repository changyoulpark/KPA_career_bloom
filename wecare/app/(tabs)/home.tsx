import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Card from '../../components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CardData {
  key: string;
  title: string;
  description?: string;
  href: string;
  count: number;
}

const CARD_CONFIG: Omit<CardData, 'count'>[] = [
  {
    key: 'reflect',
    title: 'Reflect',
    description: 'Daily reflections',
    href: '/reflect',
  },
  {
    key: 'voice',
    title: 'Voice',
    description: 'Voice notes',
    href: '/voice',
  },
  {
    key: 'check',
    title: 'Check',
    description: 'Check-in tasks',
    href: '/check',
  },
];

export default function Home() {
  const [cards, setCards] = useState<CardData[]>(
    CARD_CONFIG.map((c) => ({ ...c, count: 0 }))
  );

  useEffect(() => {
    async function loadCounts() {
      try {
        const loaded = await Promise.all(
          CARD_CONFIG.map(async (cfg) => {
            const stored = await AsyncStorage.getItem(`${cfg.key}Count`);
            const count = stored ? parseInt(stored, 10) : 0;
            return { ...cfg, count } as CardData;
          })
        );
        loaded.sort((a, b) => a.count - b.count);
        setCards(loaded);
      } catch (e) {
        // ignore errors, keep default ordering
      }
    }
    loadCounts();
  }, []);

  return (
    <View style={styles.container}>
      {cards.map((card) => (
        <Card
          key={card.key}
          title={card.title}
          description={card.description}
          href={card.href}
          storageKey={`${card.key}Count`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
});
