import { Activity, ActivityTag, MotivationMessage, MicroMission, WeeklySummary } from './types';

export function generateMotivationMessage(
  summary: WeeklySummary,
  recentActivities: Activity[]
): MotivationMessage[] {
  const messages: MotivationMessage[] = [];
  const now = new Date().toISOString();

  // Achievement messages based on progress
  if (summary.changePct > 0) {
    messages.push({
      id: `achievement_${Date.now()}`,
      type: 'achievement',
      message: `🎉 축하합니다! 지난주보다 ${summary.changePct.toFixed(1)}% 더 많은 활동을 했어요. 꾸준한 노력이 빛을 발하고 있습니다!`,
      data: { improvement: `${summary.changePct.toFixed(1)}%` },
      timestamp: now
    });
  }

  // Milestone messages
  const totalHours = Math.round(summary.total / 3600);
  if (totalHours >= 10) {
    messages.push({
      id: `milestone_${Date.now()}`,
      type: 'milestone',
      message: `🏆 이번 주에 총 ${totalHours}시간을 투자했어요! 이 정도 노력이면 충분히 경쟁력 있는 지원자가 되었습니다.`,
      data: { timeSpent: totalHours },
      timestamp: now
    });
  }

  // Encouragement based on top activities
  const topActivity = Object.entries(summary.byTag)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topActivity && topActivity[1] > 0) {
    const [tag, seconds] = topActivity;
    const hours = Math.round(seconds / 3600);
    messages.push({
      id: `encouragement_${Date.now()}`,
      type: 'encouragement',
      message: `💪 ${tag} 활동에 ${hours}시간을 투자하셨네요. 이런 집중력이면 목표 달성이 코앞입니다!`,
      timestamp: now
    });
  }

  // Nudge messages for balanced growth
  const lowActivityTags = Object.entries(summary.byTag)
    .filter(([,seconds]) => seconds < 1800) // Less than 30 minutes
    .map(([tag]) => tag);
    
  if (lowActivityTags.includes('면접준비')) {
    messages.push({
      id: `nudge_${Date.now()}`,
      type: 'nudge',
      message: `💡 실무 역량도 중요하지만, 면접 준비도 잊지 마세요. 오늘 30분만 모의면접 연습을 해보는 건 어떨까요?`,
      timestamp: now
    });
  }

  return messages;
}

export function generateMicroMissions(
  userProfile: any,
  recentActivities: Activity[]
): MicroMission[] {
  const missions: MicroMission[] = [];
  const today = new Date().toISOString();
  
  // Basic daily missions
  const basicMissions = [
    {
      title: '관심 기업 채용공고 1개 스크랩하기',
      description: '목표로 하는 기업의 최근 채용공고를 찾아 요구사항을 확인해보세요',
      category: '기업분석' as ActivityTag,
      targetDuration: 15 * 60, // 15 minutes
    },
    {
      title: '자소서 한 문단 다시 읽기',
      description: '자기소개서 중 한 항목을 다시 읽고 개선점을 찾아보세요',
      category: '자기소개서' as ActivityTag,
      targetDuration: 10 * 60, // 10 minutes
    },
    {
      title: '오늘의 활동 음성으로 기록하기',
      description: '하루 동안 한 취업 준비 활동을 간단히 음성으로 기록해보세요',
      category: '기타' as ActivityTag,
      targetDuration: 5 * 60, // 5 minutes
    }
  ];

  // Generate missions based on user's weak areas
  const weakAreas = findWeakAreas(recentActivities);
  const targetMissions = generateTargetedMissions(weakAreas);

  // Combine and select 2-3 missions for today
  const allMissions = [...basicMissions, ...targetMissions];
  const selectedMissions = allMissions.slice(0, 3).map((mission, index) => ({
    id: `mission_${today}_${index}`,
    ...mission,
    completed: false,
    dateAssigned: today,
  }));

  return selectedMissions;
}

function findWeakAreas(activities: Activity[]): ActivityTag[] {
  const lastWeekActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return activityDate > weekAgo;
  });

  const tagCounts: Record<string, number> = {};
  lastWeekActivities.forEach(activity => {
    tagCounts[activity.tag] = (tagCounts[activity.tag] || 0) + 1;
  });

  // Find tags with low activity
  const importantTags: ActivityTag[] = ['면접준비', '기업분석', '자기소개서', '포트폴리오'];
  return importantTags.filter(tag => (tagCounts[tag] || 0) < 2);
}

function generateTargetedMissions(weakAreas: ActivityTag[]): any[] {
  const targetedMissions: Record<ActivityTag, any> = {
    '면접준비': {
      title: '예상 질문 5개 답변 준비하기',
      description: '자주 나오는 면접 질문에 대한 답변을 미리 생각해보세요',
      category: '면접준비' as ActivityTag,
      targetDuration: 30 * 60,
    },
    '기업분석': {
      title: '목표 기업 최근 뉴스 확인하기',
      description: '지원하려는 기업의 최근 동향과 이슈를 파악해보세요',
      category: '기업분석' as ActivityTag,
      targetDuration: 20 * 60,
    },
    '자기소개서': {
      title: '경험 사례 하나 더 추가하기',
      description: '자소서에 활용할 수 있는 새로운 경험 사례를 생각해보세요',
      category: '자기소개서' as ActivityTag,
      targetDuration: 25 * 60,
    },
    '포트폴리오': {
      title: '포트폴리오 한 부분 업데이트하기',
      description: '최근 작업이나 프로젝트를 포트폴리오에 반영해보세요',
      category: '포트폴리오' as ActivityTag,
      targetDuration: 45 * 60,
    },
  };

  return weakAreas.map(tag => targetedMissions[tag]).filter(Boolean);
}