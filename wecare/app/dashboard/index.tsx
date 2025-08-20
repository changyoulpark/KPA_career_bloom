import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Activity } from '../../lib/types';
import { loadActivities, loadApplyCount } from '../../lib/storage';

const WEEKLY_GOAL_MIN = 150;
const MONTHLY_GOAL_MIN = 600;

function calculateStreak(acts: Activity[]): number {
  const dates = new Set(acts.map((a) => a.date.split('T')[0]));
  let streak = 0;
  const day = new Date();
  while (true) {
    const key = day.toISOString().split('T')[0];
    if (dates.has(key)) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function sumDuration(acts: Activity[], days: number): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return acts
    .filter((a) => new Date(a.date) >= cutoff)
    .reduce((acc, cur) => acc + cur.durationSec, 0);
}

export default function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [applyCount, setApplyCount] = useState(0);
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    loadActivities().then(setActivities);
    loadApplyCount().then(setApplyCount);
  }, []);

  const streak = calculateStreak(activities);
  const totalSec = tab === 'weekly' ? sumDuration(activities, 7) : sumDuration(activities, 30);
  const totalMin = Math.round(totalSec / 60);
  const goal = tab === 'weekly' ? WEEKLY_GOAL_MIN : MONTHLY_GOAL_MIN;
  const progress = Math.min(100, Math.round((totalMin / goal) * 100));

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title="주간" onPress={() => setTab('weekly')} />
        <Button title="월간" onPress={() => setTab('monthly')} />
      </View>
      <Text>{`Streak: ${streak}일`}</Text>
      <Text>{`활동 시간: ${totalMin}분`}</Text>
      <Text>{`목표 대비 진행률: ${progress}% (${totalMin}/${goal}분)`}</Text>
      <Text>{`지원 버튼 클릭: ${applyCount}`}</Text>
    </View>
  );
}
