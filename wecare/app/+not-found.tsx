import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    try {
      router.replace('/');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleGoBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="warning-outline" size={80} color="#FF6B6B" style={styles.icon} />
        <Text style={styles.title}>페이지를 찾을 수 없습니다</Text>
        <Text style={styles.subtitle}>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
            <Ionicons name="home" size={20} color="white" />
            <Text style={styles.primaryButtonText}>홈으로 이동</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>이전 페이지로</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.troubleshootContainer}>
          <Text style={styles.troubleshootTitle}>문제 해결 방법:</Text>
          <Text style={styles.troubleshootText}>• URL을 확인해 주세요</Text>
          <Text style={styles.troubleshootText}>• 홈 버튼을 눌러 처음부터 시작하세요</Text>
          <Text style={styles.troubleshootText}>• 문제가 지속되면 앱을 재시작해 보세요</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  troubleshootContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  troubleshootText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});