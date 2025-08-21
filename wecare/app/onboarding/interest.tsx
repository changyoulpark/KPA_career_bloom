import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { loadUser, saveUser } from '../../lib/storage';

export default function InterestScreen() {
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        const user = await loadUser();
        setInterest(user.profile.interest || '');
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
    // Simple validation - interest should be at least 2 characters
    setIsValid(interest.trim().length >= 2);
  }, [interest]);

  const handleComplete = async () => {
    if (!isValid) {
      Alert.alert(
        '입력 확인',
        '관심 직무를 2자 이상 입력해 주세요.',
        [{ text: '확인', style: 'default' }]
      );
      return;
    }

    try {
      const user = await loadUser();
      user.profile.interest = interest;
      await saveUser(user);
      
      // Show completion message
      Alert.alert(
        '온보딩 완료!',
        '프로필 설정이 완료되었습니다. 이제 앱을 사용할 준비가 되었어요!',
        [{ 
          text: '시작하기', 
          style: 'default',
          onPress: () => {
            try {
              router.replace('/(tabs)/home');
            } catch (error) {
              console.error('Navigation error:', error);
              // Fallback navigation
              router.replace('/');
            }
          }
        }]
      );
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
        <Text style={styles.title}>관심 직무를 입력하세요</Text>
        <Text style={styles.subtitle}>
          어떤 분야의 일에 관심이 있으신가요?
        </Text>
        
        <TextInput 
          value={interest} 
          onChangeText={setInterest} 
          style={[styles.input, !isValid && interest.length > 0 && styles.inputError]}
          placeholder="예: 웹 개발, UI/UX 디자인, 데이터 분석, 마케팅..."
          placeholderTextColor="#999"
          multiline
          maxLength={200}
        />
        
        {!isValid && interest.length > 0 && (
          <Text style={styles.validationText}>관심 직무를 2자 이상 입력해 주세요</Text>
        )}
        
        <TouchableOpacity
          style={[styles.completeButton, !isValid && styles.disabledButton]}
          onPress={handleComplete}
          disabled={!isValid}
        >
          <Text style={styles.completeButtonText}>완료</Text>
        </TouchableOpacity>
        
        <Text style={styles.stepIndicator}>3/3 단계</Text>
        
        <View style={styles.congratsContainer}>
          <Text style={styles.congratsText}>
            🎉 거의 다 완료되었습니다!
          </Text>
        </View>
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
    minHeight: 80,
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
  completeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  completeButtonText: {
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
  congratsContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  congratsText: {
    color: '#155724',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
