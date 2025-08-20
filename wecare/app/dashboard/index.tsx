import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg from 'react-native-svg';
import { VictoryPie } from 'victory-native';
import { loadWeeklySummary, WeeklySummary } from '../../lib/storage';

export default function Dashboard() {
  const [summary, setSummary] = useState<WeeklySummary | null>(null);

  useEffect(() => {
    loadWeeklySummary().then(setSummary);
  }, []);

  if (!summary) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text>{`총 활동 시간: ${Math.round(summary.total / 60)}분`}</Text>
      <Text>{`전주 대비: ${
        summary.percentChange >= 0 ? '+' : ''
      }${summary.percentChange.toFixed(1)}%`}</Text>
      <Svg width={300} height={300}>
        <VictoryPie
          standalone={false}
          width={300}
          height={300}
          data={Object.entries(summary.byTag).map(([tag, pct]) => ({
            x: tag,
            y: pct,
          }))}
          labels={({ datum }) => `${datum.x} ${datum.y.toFixed(1)}%`}
        />
      </Svg>
    </View>
  );
}

