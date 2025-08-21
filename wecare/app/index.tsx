import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate app initialization check
    const initializeApp = async () => {
      try {
        // Add some basic validation checks here
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if basic routes exist (this is a simple client-side check)
        const routesToCheck = ['/onboarding/goal', '/onboarding/qualification', '/onboarding/interest'];
        
        // In a real app, you might want to check server connectivity here
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleStartPress = async () => {
    if (hasError) {
      Alert.alert(
        '오류 발생',
        '앱 초기화 중 오류가 발생했습니다. 다시 시도하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '다시 시도', 
            onPress: () => {
              setHasError(false);
              setIsLoading(true);
              // Trigger re-initialization
              setTimeout(() => setIsLoading(false), 1000);
            }
          }
        ]
      );
      return;
    }

    try {
      router.push('/onboarding/goal');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert(
        '네비게이션 오류',
        '온보딩 페이지로 이동할 수 없습니다. 다시 시도해 주세요.',
        [{ text: '확인', style: 'default' }]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>앱 준비 중...</Text>
        <Text style={styles.subtitle}>잠시만 기다려 주세요</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>온보딩을 시작합니다</Text>
      <Text style={styles.subtitle}>
        취업 준비를 위한 여정을 시작해보세요
      </Text>
      
      <TouchableOpacity
        style={[styles.startButton, hasError && styles.errorButton]}
        onPress={handleStartPress}
        disabled={hasError}
      >
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>

      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            ⚠️ 일부 기능이 제대로 작동하지 않을 수 있습니다
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
});