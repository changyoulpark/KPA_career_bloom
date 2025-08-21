import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { 
  loadMicroMissions, 
  saveMicroMissions, 
  loadUser, 
  loadActivities,
  completeMission
} from '../../lib/storage';
import { generateMicroMissions } from '../../lib/motivation';
import { MicroMission } from '../../lib/types';

export default function SupportScreen() {
  const [missions, setMissions] = useState<MicroMission[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadMissionsData();
  }, []);

  const loadMissionsData = async () => {
    try {
      const [existingMissions, user, activities] = await Promise.all([
        loadMicroMissions(),
        loadUser(),
        loadActivities()
      ]);

      const today = new Date().toDateString();
      const todaysMissions = existingMissions.filter(
        mission => new Date(mission.dateAssigned).toDateString() === today
      );

      if (todaysMissions.length === 0) {
        // Generate new missions for today
        const newMissions = generateMicroMissions(user.profile, activities);
        const allMissions = [...existingMissions, ...newMissions];
        await saveMicroMissions(allMissions);
        setMissions(newMissions);
      } else {
        setMissions(todaysMissions);
      }

      const completed = todaysMissions.filter(m => m.completed).length;
      setCompletedCount(completed);
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  };

  const handleCompleteMission = async (missionId: string) => {
    try {
      await completeMission(missionId);
      const updatedMissions = missions.map(mission => 
        mission.id === missionId 
          ? { ...mission, completed: true, dateCompleted: new Date().toISOString() }
          : mission
      );
      setMissions(updatedMissions);
      setCompletedCount(prev => prev + 1);
      
      // Show encouragement alert
      Alert.alert(
        '🎉 미션 완료!', 
        '훌륭해요! 꾸준한 노력이 성공으로 이어집니다.',
        [{ text: '확인', style: 'default' }]
      );
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
  };

  const getProgressMessage = () => {
    if (completedCount === 0) {
      return "💪 오늘도 화이팅! 작은 실천이 큰 변화를 만들어요.";
    } else if (completedCount === missions.length) {
      return "🏆 오늘의 모든 미션을 완료했어요! 정말 대단합니다!";
    } else {
      return `✨ ${completedCount}개 미션 완료! 남은 미션도 화이팅!`;
    }
  };

  const getMissionIcon = (category: string) => {
    const icons: Record<string, string> = {
      '기업분석': '🔍',
      '자기소개서': '📝',
      '면접준비': '💼',
      '포트폴리오': '🎨',
      '코딩': '💻',
      '네트워킹': '🤝',
      '자격증': '📜',
      '기타': '✅'
    };
    return icons[category] || '✅';
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Header with progress */}
      <View style={{ backgroundColor: '#e8f5e8', padding: 16, borderRadius: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
          🎯 오늘의 미션
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', color: '#2e7d32' }}>
          {getProgressMessage()}
        </Text>
        <View style={{ 
          backgroundColor: '#4caf50', 
          height: 8, 
          borderRadius: 4, 
          marginTop: 12,
          overflow: 'hidden'
        }}>
          <View style={{ 
            backgroundColor: '#81c784', 
            height: '100%', 
            width: `${missions.length > 0 ? (completedCount / missions.length) * 100 : 0}%`,
            borderRadius: 4
          }} />
        </View>
        <Text style={{ textAlign: 'center', marginTop: 4, fontSize: 12, color: '#2e7d32' }}>
          {completedCount}/{missions.length} 완료
        </Text>
      </View>

      {/* Missions List */}
      <View style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>📋 오늘의 할일</Text>
        {missions.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6c757d', fontSize: 16 }}>
            미션을 불러오는 중...
          </Text>
        ) : (
          missions.map((mission) => (
            <View 
              key={mission.id} 
              style={{ 
                backgroundColor: mission.completed ? '#e8f5e8' : 'white',
                padding: 16, 
                marginBottom: 12, 
                borderRadius: 8,
                borderWidth: 1,
                borderColor: mission.completed ? '#4caf50' : '#dee2e6'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <Text style={{ fontSize: 20 }}>
                  {getMissionIcon(mission.category)}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: 'bold', 
                    textDecorationLine: mission.completed ? 'line-through' : 'none',
                    color: mission.completed ? '#6c757d' : '#000'
                  }}>
                    {mission.title}
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#6c757d', 
                    marginTop: 4 
                  }}>
                    {mission.description}
                  </Text>
                  {mission.targetDuration && (
                    <Text style={{ 
                      fontSize: 12, 
                      color: '#6c757d', 
                      marginTop: 4 
                    }}>
                      예상 소요시간: {Math.round(mission.targetDuration / 60)}분
                    </Text>
                  )}
                </View>
                {!mission.completed && (
                  <TouchableOpacity
                    onPress={() => handleCompleteMission(mission.id)}
                    style={{ 
                      backgroundColor: '#28a745',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                      완료
                    </Text>
                  </TouchableOpacity>
                )}
                {mission.completed && (
                  <View style={{ 
                    backgroundColor: '#4caf50',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6
                  }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                      ✓ 완료됨
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Encouragement Messages */}
      <View style={{ backgroundColor: '#e3f2fd', padding: 16, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>💬 응원의 한마디</Text>
        <View style={{ 
          backgroundColor: 'white', 
          padding: 12, 
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: '#2196f3'
        }}>
          <Text style={{ fontSize: 16, lineHeight: 22 }}>
            💪 취업 준비는 마라톤과 같아요. 오늘 하루하루의 작은 노력이 모여 큰 성과를 만들어냅니다. 
            포기하지 말고 꾸준히 전진하세요!
          </Text>
        </View>
      </View>

      {/* Tips Section */}
      <View style={{ backgroundColor: '#fff3e0', padding: 16, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>💡 오늘의 팁</Text>
        <Text style={{ fontSize: 16, lineHeight: 22 }}>
          🎯 <Text style={{ fontWeight: 'bold' }}>작은 목표부터 시작하세요:</Text> 
          {' '}큰 목표를 작은 단위로 나누어 하나씩 달성해가며 성취감을 느껴보세요. 
          작은 승리가 모여 큰 성공을 만들어냅니다.
        </Text>
      </View>
    </ScrollView>
  );
}