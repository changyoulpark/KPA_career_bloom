import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Chip from '../../components/Chip';
import jobsData from '../../assets/jobs.json';

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  closingDate: string; // ISO string
  activityMatch: boolean;
  recommendationScore: number;
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return diff / (1000 * 60 * 60 * 24);
}

export default function JobsScreen() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [onlyClosingSoon, setOnlyClosingSoon] = useState(false);
  const [onlyActivityMatch, setOnlyActivityMatch] = useState(false);

  const jobs: Job[] = jobsData as Job[];
  const locations = Array.from(new Set(jobs.map((j) => j.location)));
  const jobTypes = Array.from(new Set(jobs.map((j) => j.jobType)));

  const filtered = jobs
    .filter((j) => !selectedLocation || j.location === selectedLocation)
    .filter((j) => !selectedJobType || j.jobType === selectedJobType)
    .filter((j) => !onlyClosingSoon || daysUntil(j.closingDate) <= 7)
    .filter((j) => !onlyActivityMatch || j.activityMatch)
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {locations.map((loc) => (
          <Chip
            key={loc}
            label={loc}
            selected={selectedLocation === loc}
            onPress={() =>
              setSelectedLocation(selectedLocation === loc ? null : loc)
            }
          />
        ))}
        {jobTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            selected={selectedJobType === type}
            onPress={() =>
              setSelectedJobType(selectedJobType === type ? null : type)
            }
          />
        ))}
        <Chip
          label="마감 임박"
          selected={onlyClosingSoon}
          onPress={() => setOnlyClosingSoon(!onlyClosingSoon)}
        />
        <Chip
          label="활동 일치"
          selected={onlyActivityMatch}
          onPress={() => setOnlyActivityMatch(!onlyActivityMatch)}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: '#eee',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
            <Text>
              {item.location} · {item.jobType}
            </Text>
            <Text>마감일: {item.closingDate}</Text>
          </View>
        )}
      />
    </View>
  );
}
