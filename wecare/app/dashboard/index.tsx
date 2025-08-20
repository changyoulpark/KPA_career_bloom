import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg from 'react-native-svg';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import StatRow from '../../components/StatRow';
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
    y: Math.round(sec / 60),
  }));

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <StatRow label="이번 주 합계" value={`${Math.round(summary.total / 60)}분`} />
      <StatRow label="전주 대비 증감" value={`${summary.changePct.toFixed(1)}%`} />
      {chartData.length > 0 && (
        <Svg width={300} height={250}>
          <VictoryChart
            standalone={false}
            width={300}
            height={250}
            domainPadding={{ x: 20 }}
          >
            <VictoryAxis dependentAxis tickFormat={(t) => `${t}m`} />
            <VictoryAxis style={{ tickLabels: { angle: -45, fontSize: 10 } }} />
            <VictoryBar data={chartData} />
          </VictoryChart>
        </Svg>
      )}
    </View>
  );
}

