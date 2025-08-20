import { View, Text } from 'react-native';

interface StatRowProps {
  label: string;
  value: string;
}

export default function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 16 }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{value}</Text>
    </View>
  );
}
