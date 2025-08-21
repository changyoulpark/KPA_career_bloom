import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { loadUser, saveUser } from '../../lib/storage';

export default function QualificationScreen() {
  const [qualification, setQualification] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        const user = await loadUser();
        setQualification(user.profile.qualification || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setIsLoading(false);
        Alert.alert(
          '데이터 로드 오류',
          '사용자 정보를 불러오는데 실패했습니다.',
          [{ text: '확인', style: 'default' }]
        );
      }
    };

    initializeScreen();
  }, []);

  useEffect(() => {
    // Simple validation - qualification should be at least 2 characters
    setIsValid(qualification.trim().length >= 2);
  }, [qualification]);

  const handleNext = async () => {
    if (!isValid) {
      Alert.alert(
        '입력 확인',
        '자격사항을 2자 이상 입력해 주세요.',
        [{ text: '확인', style: 'default' }]
      );
      return;
    }

    try {
      const user = await loadUser();
      user.profile.qualification = qualification;
      await saveUser(user);
      
      // Navigate to next screen
      router.push('/onboarding/interest');
    } catch (error) {
      console.error('Failed to save user data:', error);
      Alert.alert(
        '저장 오류',
        '정보 저장에 실패했습니다. 다시 시도해 주세요.',
        [{ text: '확인', style: 'default' }]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>자격사항을 입력하세요</Text>
        <Text style={styles.subtitle}>
          보유하신 자격증, 학위, 경험 등을 입력해 주세요
        </Text>
        
        <TextInput
          value={qualification}
          onChangeText={setQualification}
          style={[styles.input, !isValid && qualification.length > 0 && styles.inputError]}
          placeholder="예: 컴퓨터공학 학사, 정보처리기사, React 경험 2년..."
          placeholderTextColor="#999"
          multiline
          maxLength={300}
        />
        
        {!isValid && qualification.length > 0 && (
          <Text style={styles.validationText}>자격사항을 2자 이상 입력해 주세요</Text>
        )}
        
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.disabledButton]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
        
        <Text style={styles.stepIndicator}>2/3 단계</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#f44336',
  },
  validationText: {
    color: '#f44336',
    fontSize: 14,
    marginTop: -8,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepIndicator: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 16,
  },
});
