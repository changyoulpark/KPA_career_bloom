import { useEffect, useMemo, useState } from 'react';
import { View, FlatList } from 'react-native';
import Chip from '../../components/Chip';
import JobCell, { Job } from '../../components/JobCell';
import { loadActivities } from '../../lib/storage';
import { Activity } from '../../lib/types';
import jobsData from '../../assets/jobs.json';

export default function Jobs() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [region, setRegion] = useState<string | null>(null);
  const [jobType, setJobType] = useState<string | null>(null);
  const [soon, setSoon] = useState(false);
  const [match, setMatch] = useState(false);

  useEffect(() => {
    loadActivities().then(setActivities);
  }, []);

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
    .filter((j) => !match || j.tags.some((t) => activities.some((a) => a.tag === t)))
    .sort((a, b) => b.score - a.score);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
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
        <Chip label="활동 일치" selected={match} onPress={() => setMatch(!match)} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCell job={item} />}
      />
    </View>
  );
}
