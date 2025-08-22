import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { loadUser } from '../lib/storage';

export default function Index() {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartPress = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Add a small delay for user feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      // Test data loading
      await loadUser();
      
      console.log('Navigating to onboarding/goal');
      router.push('/onboarding/goal');

    } catch (error) {
      console.error('Start button error:', error);
      setHasError(true);
      
      Alert.alert(
        '시작 오류',
        '앱을 시작하는데 문제가 발생했습니다. 다시 시도해 주세요.',
        [
          { text: '다시 시도', onPress: () => {
            setHasError(false);
            setIsLoading(false);
          }},
          { text: '취소', style: 'cancel', onPress: () => setIsLoading(false) }
        ]
      );
    } finally {
      if (!hasError) {
        // Keep loading state briefly to show transition
        setTimeout(() => setIsLoading(false), 200);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>온보딩을 시작합니다</Text>
      <Text style={styles.subtitle}>
        취업 준비를 위한 여정을 시작해보세요
      </Text>
      
      <TouchableOpacity
        style={[
          styles.startButton, 
          hasError && styles.errorButton,
          isLoading && styles.loadingButton
        ]}
        onPress={handleStartPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.startButtonText}>로딩 중...</Text>
          </View>
        ) : (
          <Text style={styles.startButtonText}>시작하기</Text>
        )}
      </TouchableOpacity>

      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            ⚠️ 문제가 발생했습니다. 다시 시도해 주세요.
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
    elevation: 3,
  },
  errorButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  loadingButton: {
    backgroundColor: '#28a745',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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