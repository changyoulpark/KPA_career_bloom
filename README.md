# KPA_career_bloom

A project from the Korean Psychological Association’s Empathy & Innovation Camp. Career Bloom aims to help long-term job seekers overcome sunk costs, regain life satisfaction, and build meaningful career opportunities through resilience, skill development, and community support.

## React Native demo

`wecare/` contains an Expo-based prototype that records voice, sends transcripts to Gemini for summarization and tagging, and stores the resulting activities locally.

### Run
```bash
cd wecare
npm install
npx expo start
```

Set `EXPO_PUBLIC_GEMINI_API_KEY` in your environment to enable the Gemini API call.
