import { View, Text } from 'react-native';
import { ActivityTag } from '../lib/types';

export interface Job {
  id: string;
  title: string;
  company: string;
  region: string;
  jobType: string;
  deadline: string; // ISO
  score: number;
  tags: ActivityTag[];
}

export default function JobCell({ job }: { job: Job }) {
  return (
    <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#ddd' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{job.title}</Text>
      <Text>{job.company}</Text>
      <Text>{`${job.region} · ${job.jobType}`}</Text>
      <Text>{`마감: ${job.deadline}`}</Text>
      <Text>{`추천 점수: ${job.score}`}</Text>
    </View>
  );
}
