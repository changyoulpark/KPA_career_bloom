import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>온보딩을 시작합니다</Text>
      <Text style={styles.subtitle}>
        취업 준비를 위한 여정을 시작해보세요
      </Text>
      
      <Link href="/onboarding/goal" asChild>
        <TouchableOpacity
          style={[styles.startButton, hasError && styles.errorButton]}
          disabled={hasError}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </TouchableOpacity>
      </Link>

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