import { Pressable, Text } from 'react-native';
import { ReactNode } from 'react';

interface CardProps {
  text: string;
  icon?: ReactNode;
  round?: boolean;
  onPress?: () => void;
}

export default function Card({ text, icon, round, onPress }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 16,
        borderRadius: round ? 999 : 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {icon}
      <Text style={{ fontSize: 16 }}>{text}</Text>
    </Pressable>
  );
}
