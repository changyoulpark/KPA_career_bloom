import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Svg from 'react-native-svg';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine } from 'victory-native';
import StatRow from '../../../components/StatRow';
import { 
  loadWeeklySummary, 
  WeeklySummary, 
  loadActivities,
  loadMotivationMessages,
  saveMotivationMessages
} from '../../../lib/storage';
import { generateMotivationMessage } from '../../../lib/motivation';
import { MotivationMessage } from '../../../lib/types';

export default function Dashboard() {
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [motivationMessages, setMotivationMessages] = useState<MotivationMessage[]>([]);
  const [showAllMessages, setShowAllMessages] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, activities, existingMessages] = await Promise.all([
        loadWeeklySummary(),
        loadActivities(),
        loadMotivationMessages()
      ]);
      
      setSummary(summaryData);
      
      // Generate new motivation messages if needed
      const today = new Date().toDateString();
      const todaysMessages = existingMessages.filter(
        msg => new Date(msg.timestamp).toDateString() === today
      );
      
      if (todaysMessages.length === 0 && summaryData.total > 0) {
        const newMessages = generateMotivationMessage(summaryData, activities);
        const allMessages = [...existingMessages, ...newMessages];
        await saveMotivationMessages(allMessages);
        setMotivationMessages(allMessages);
      } else {
        setMotivationMessages(existingMessages);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

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

  // Get recent messages (last 3 for compact view)
  const recentMessages = motivationMessages
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, showAllMessages ? 10 : 3);

  const getMessageIcon = (type: MotivationMessage['type']) => {
    switch (type) {
      case 'achievement': return '🎉';
      case 'milestone': return '🏆';
      case 'encouragement': return '💪';
      case 'nudge': return '💡';
      default: return '✨';
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Weekly Summary */}
      <View style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>📊 이번 주 활동 요약</Text>
        <StatRow label="총 활동 시간" value={`${Math.round(summary.total / 3600)}시간 ${Math.round((summary.total % 3600) / 60)}분`} />
        <StatRow 
          label="전주 대비" 
          value={`${summary.changePct >= 0 ? '+' : ''}${summary.changePct.toFixed(1)}%`}
          valueStyle={{ color: summary.changePct >= 0 ? '#28a745' : '#dc3545' }}
        />
      </View>

      {/* Motivation Messages */}
      {recentMessages.length > 0 && (
        <View style={{ backgroundColor: '#e3f2fd', padding: 16, borderRadius: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>💬 오늘의 응원 메시지</Text>
            <TouchableOpacity onPress={() => setShowAllMessages(!showAllMessages)}>
              <Text style={{ color: '#1976d2', fontSize: 14 }}>
                {showAllMessages ? '접기' : '더보기'}
              </Text>
            </TouchableOpacity>
          </View>
          {recentMessages.map((message, index) => (
            <View 
              key={message.id} 
              style={{ 
                backgroundColor: 'white', 
                padding: 12, 
                marginBottom: 8, 
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: '#1976d2'
              }}
            >
              <Text style={{ fontSize: 16, lineHeight: 22 }}>
                {getMessageIcon(message.type)} {message.message}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Activity Chart */}
      {chartData.length > 0 && (
        <View style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>📈 활동별 시간 분포</Text>
          <Svg width={300} height={250}>
            <VictoryChart
              standalone={false}
              width={300}
              height={250}
              domainPadding={{ x: 20 }}
            >
              <VictoryAxis dependentAxis tickFormat={(t) => `${t}분`} />
              <VictoryAxis style={{ tickLabels: { angle: -45, fontSize: 10 } }} />
              <VictoryBar 
                data={chartData} 
                style={{
                  data: { fill: "#1976d2" }
                }}
              />
            </VictoryChart>
          </Svg>
        </View>
      )}

      {/* Quick Actions */}
      <View style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>🎯 빠른 실행</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#007AFF', 
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              borderRadius: 6 
            }}
            onPress={() => {/* Navigate to voice record */}}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>🎤 음성 기록</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#28a745', 
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              borderRadius: 6 
            }}
            onPress={() => {/* Navigate to missions */}}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>✅ 오늘의 미션</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#17a2b8', 
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              borderRadius: 6 
            }}
            onPress={() => {/* Navigate to company recommendations */}}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>🏢 기업 추천</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

