import { Pressable, Text } from 'react-native';

interface CardProps {
  title: string;
  onPress: () => void;
}

export default function Card({ title, onPress }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}
    >
      <Text style={{ fontSize: 16 }}>{title}</Text>
    </Pressable>
  );
}
