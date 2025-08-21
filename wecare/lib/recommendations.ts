import { Activity, ActivityTag, Profile } from './types';
import { Job } from '../components/JobCell';

export interface RecommendationScore {
  company: string;
  jobId: string;
  score: number;
  reasons: string[];
  matchingActivities: ActivityTag[];
  strengthLevel: 'beginner' | 'intermediate' | 'advanced';
}

export function calculateRecommendationScore(
  job: Job,
  userActivities: Activity[],
  userProfile: Profile
): RecommendationScore {
  const reasons: string[] = [];
  const matchingActivities: ActivityTag[] = [];
  let score = 0;

  // Calculate activity-based matching
  const userTags = userActivities.map(a => a.tag);
  const uniqueUserTags = Array.from(new Set(userTags));
  
  for (const jobTag of job.tags) {
    if (uniqueUserTags.includes(jobTag)) {
      matchingActivities.push(jobTag);
      
      // Calculate time spent on this activity
      const totalTime = userActivities
        .filter(a => a.tag === jobTag)
        .reduce((sum, a) => sum + a.durationSec, 0);
      
      const hours = Math.round(totalTime / 3600);
      
      if (hours > 0) {
        score += Math.min(hours * 2, 20); // Max 20 points per activity
        reasons.push(`${jobTag} 활동을 ${hours}시간 경험했습니다`);
      }
    }
  }

  // Profile-based matching (interest, goal alignment)
  if (userProfile.interest && job.jobType.includes(userProfile.interest.split(' ')[0])) {
    score += 15;
    reasons.push('관심 분야와 일치합니다');
  }

  // Experience level calculation
  const totalExperienceHours = userActivities.reduce((sum, a) => sum + a.durationSec / 3600, 0);
  let strengthLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  
  if (totalExperienceHours > 100) {
    strengthLevel = 'advanced';
    score += 10;
    reasons.push('풍부한 경험을 보유하고 있습니다');
  } else if (totalExperienceHours > 40) {
    strengthLevel = 'intermediate';
    score += 5;
    reasons.push('적절한 경험을 보유하고 있습니다');
  }

  // Bonus for recent activity (last 2 weeks)
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const recentActivity = userActivities.some(a => new Date(a.date).getTime() > twoWeeksAgo);
  if (recentActivity) {
    score += 5;
    reasons.push('최근 꾸준한 활동을 보여주고 있습니다');
  }

  return {
    company: job.company,
    jobId: job.id,
    score,
    reasons,
    matchingActivities,
    strengthLevel
  };
}

export function generatePersonalizedRecommendations(
  jobs: Job[],
  userActivities: Activity[],
  userProfile: Profile
): RecommendationScore[] {
  const recommendations = jobs
    .map(job => calculateRecommendationScore(job, userActivities, userProfile))
    .filter(rec => rec.score > 5) // Only show meaningful matches
    .sort((a, b) => b.score - a.score);

  return recommendations.slice(0, 10); // Top 10 recommendations
}

export function generateRecommendationMessage(
  recommendation: RecommendationScore,
  userProfile: Profile
): string {
  const messages = [
    `🎯 ${recommendation.company}는 당신의 ${recommendation.matchingActivities.join(', ')} 경험을 높이 평가할 것입니다!`,
    `💪 지금까지의 노력이 ${recommendation.company} 지원에 큰 도움이 될 거예요.`,
    `🚀 ${recommendation.company}에 도전할 준비가 되었습니다. 지원을 고려해보세요!`,
    `⭐ ${recommendation.company}는 당신과 완벽한 매치입니다. 자신감을 가지세요!`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getStrengthLevelMessage(level: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (level) {
    case 'beginner':
      return '🌱 신입/주니어 포지션에 적합한 수준입니다';
    case 'intermediate':
      return '🌿 중급 포지션에 도전할 수 있는 수준입니다';
    case 'advanced':
      return '🌳 시니어 포지션도 고려해볼 수 있는 수준입니다';
    default:
      return '계속 성장하고 있습니다!';
  }
}