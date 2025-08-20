import { TouchableOpacity, Text } from 'react-native';

interface Props {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export default function Chip({ label, selected = false, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: selected ? '#0052FF' : '#eee',
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: selected ? '#fff' : '#333' }}>{label}</Text>
    </TouchableOpacity>
  );
}
