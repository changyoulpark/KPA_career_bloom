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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const chartData = Object.entries(summary.byTag).map(([tag, sec]) => ({
    x: tag,
    y: sec,
  }));

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text>{`이번 주 합계: ${Math.round(summary.total / 60)}분`}</Text>
      <Text>{`전주 대비 증감: ${summary.changePct.toFixed(1)}%`}</Text>
      {chartData.length > 0 && (
        <Svg width={250} height={250}>
          <VictoryPie
            standalone={false}
            width={250}
            height={250}
            data={chartData}
          />
        </Svg>
      )}
    </View>
  );
}

