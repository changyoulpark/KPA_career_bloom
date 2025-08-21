import { useEffect, useMemo, useState } from 'react';
import { View, FlatList, Text, ScrollView, TouchableOpacity } from 'react-native';
import Chip from '../../../components/Chip';
import JobCell, { Job } from '../../../components/JobCell';
import { loadActivities, loadUser } from '../../../lib/storage';
import { Activity, Profile } from '../../../lib/types';
import { 
  generatePersonalizedRecommendations, 
  generateRecommendationMessage,
  getStrengthLevelMessage,
  RecommendationScore 
} from '../../../lib/recommendations';
import jobsData from '../../../assets/jobs.json';

export default function Jobs() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [region, setRegion] = useState<string | null>(null);
  const [jobType, setJobType] = useState<string | null>(null);
  const [soon, setSoon] = useState(false);
  const [showPersonalized, setShowPersonalized] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [activitiesData, userData] = await Promise.all([
        loadActivities(),
        loadUser()
      ]);
      
      setActivities(activitiesData);
      setUserProfile(userData.profile);
      
      // Generate personalized recommendations
      const jobs: Job[] = jobsData as Job[];
      const personalizedRecs = generatePersonalizedRecommendations(
        jobs, 
        activitiesData, 
        userData.profile
      );
      setRecommendations(personalizedRecs);
    } catch (error) {
      console.error('Failed to load job data:', error);
    }
  };

  const jobs: Job[] = jobsData as Job[];
  const regions = useMemo(() => Array.from(new Set(jobs.map((j) => j.region))), [jobs]);
  const jobTypes = useMemo(() => Array.from(new Set(jobs.map((j) => j.jobType))), [jobs]);

  const now = new Date();

  const filtered = jobs
    .filter((j) => !region || j.region === region)
    .filter((j) => !jobType || j.jobType === jobType)
    .filter(
      (j) =>
        !soon ||
        (new Date(j.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7
    )
    .sort((a, b) => {
      if (showPersonalized) {
        const recA = recommendations.find(r => r.jobId === a.id);
        const recB = recommendations.find(r => r.jobId === b.id);
        return (recB?.score || 0) - (recA?.score || 0);
      }
      return b.score - a.score;
    });

  const renderRecommendationCard = (rec: RecommendationScore) => {
    const job = jobs.find(j => j.id === rec.jobId);
    if (!job) return null;

    return (
      <View 
        key={rec.jobId} 
        style={{ 
          backgroundColor: 'white', 
          padding: 16, 
          marginBottom: 12, 
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#4caf50'
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2e7d32' }}>
              🎯 {job.company}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 2 }}>{job.title}</Text>
            <Text style={{ fontSize: 14, color: '#6c757d', marginTop: 2 }}>
              {job.region} · {job.jobType}
            </Text>
            <Text style={{ fontSize: 14, color: '#6c757d' }}>
              마감: {new Date(job.deadline).toLocaleDateString()}
            </Text>
          </View>
          <View style={{ 
            backgroundColor: '#4caf50', 
            paddingHorizontal: 8, 
            paddingVertical: 4, 
            borderRadius: 6 
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              매치 {rec.score}점
            </Text>
          </View>
        </View>
        
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#2e7d32', marginBottom: 8 }}>
            {generateRecommendationMessage(rec, userProfile!)}
          </Text>
          
          <Text style={{ fontSize: 12, color: '#6c757d', marginBottom: 4 }}>
            {getStrengthLevelMessage(rec.strengthLevel)}
          </Text>
          
          {rec.matchingActivities.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 }}>
              {rec.matchingActivities.map((activity) => (
                <View 
                  key={activity}
                  style={{ 
                    backgroundColor: '#e8f5e8', 
                    paddingHorizontal: 8, 
                    paddingVertical: 2, 
                    borderRadius: 4 
                  }}
                >
                  <Text style={{ fontSize: 10, color: '#2e7d32' }}>#{activity}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={{ marginTop: 8 }}>
            {rec.reasons.slice(0, 2).map((reason, index) => (
              <Text key={index} style={{ fontSize: 12, color: '#6c757d', marginTop: 2 }}>
                • {reason}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Personalized Recommendations Section */}
      {recommendations.length > 0 && (
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              🎯 맞춤 추천 기업
            </Text>
            <TouchableOpacity onPress={() => setShowPersonalized(!showPersonalized)}>
              <Text style={{ color: '#2196f3', fontSize: 14 }}>
                {showPersonalized ? '전체보기' : '맞춤보기'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showPersonalized && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ backgroundColor: '#e3f2fd', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#1976d2', textAlign: 'center' }}>
                  💡 당신의 활동 기록을 바탕으로 추천된 기업들입니다
                </Text>
              </View>
              {recommendations.slice(0, 3).map(renderRecommendationCard)}
            </View>
          )}
        </View>
      )}

      {/* Filters and All Jobs */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          🏢 전체 채용 정보
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {regions.map((r) => (
              <Chip
                key={r}
                label={r}
                selected={region === r}
                onPress={() => setRegion(region === r ? null : r)}
              />
            ))}
            {jobTypes.map((jt) => (
              <Chip
                key={jt}
                label={jt}
                selected={jobType === jt}
                onPress={() => setJobType(jobType === jt ? null : jt)}
              />
            ))}
            <Chip label="마감 임박" selected={soon} onPress={() => setSoon(!soon)} />
          </View>
        </ScrollView>
        
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const rec = recommendations.find(r => r.jobId === item.id);
            return (
              <View style={{ marginBottom: 8 }}>
                <JobCell job={item} />
                {rec && (
                  <View style={{ backgroundColor: '#f8f9fa', padding: 8, marginTop: 4, borderRadius: 4 }}>
                    <Text style={{ fontSize: 12, color: '#28a745' }}>
                      ⭐ 추천 점수: {rec.score}점 | {rec.matchingActivities.join(', ')} 경험 활용 가능
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}
