import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { loadUser } from '../lib/storage';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  const handleStartPress = async () => {
    if (isLoading) return;

    try {
      console.log('Start button pressed - setting loading state...');
      setIsLoading(true);
      
      // Force a small delay to ensure state update is processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Loading state set, showing loading for visual feedback...');
      // Add delay for visual feedback  
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('Loading user data...');
      // Test storage and load user data
      const user = await loadUser();
      console.log('User data loaded successfully:', user);
      
      // Navigate to onboarding
      console.log('Navigating to onboarding/goal');
      router.push('/onboarding/goal');

    } catch (error) {
      console.error('Navigation error:', error);
      setHasError(true);
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(false);
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
          isLoading && styles.loadingButton,
          hasError && styles.errorButton
        ]}
        onPress={handleStartPress}
        disabled={isLoading || hasError}
        accessible={true}
        accessibilityLabel="온보딩 시작하기 버튼"
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
            ⚠️ 시작하는데 문제가 발생했습니다
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            🚀 데이터를 준비하고 있습니다...
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
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  statusText: {
    color: '#155724',
    fontSize: 14,
    textAlign: 'center',
  },
});