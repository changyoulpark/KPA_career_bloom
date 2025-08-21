import { View, Text, TextStyle } from 'react-native';

interface StatRowProps {
  label: string;
  value: string;
  valueStyle?: TextStyle;
}

export default function StatRow({ label, value, valueStyle }: StatRowProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 16 }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', ...valueStyle }}>{value}</Text>
    </View>
  );
}
