import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeNavigationButton } from '../../components/SafeNavigation';

export default function GoalScreen() {
  const [goal, setGoal] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Simple validation - goal should be at least 3 characters
    setIsValid(goal.trim().length >= 3);
  }, [goal]);

  const handleNext = () => {
    if (!isValid) {
      Alert.alert(
        '입력 확인',
        '목표를 3자 이상 입력해 주세요.',
        [{ text: '확인', style: 'default' }]
      );
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>목표를 입력하세요</Text>
        <Text style={styles.subtitle}>
          어떤 직업이나 목표를 향해 나아가고 계신가요?
        </Text>
        
        <TextInput 
          value={goal} 
          onChangeText={setGoal} 
          style={[styles.input, !isValid && goal.length > 0 && styles.inputError]}
          placeholder="예: 프론트엔드 개발자, 기획자, 디자이너..."
          placeholderTextColor="#999"
          multiline
          maxLength={200}
        />
        
        {!isValid && goal.length > 0 && (
          <Text style={styles.validationText}>목표를 3자 이상 입력해 주세요</Text>
        )}
        
        <SafeNavigationButton
          href="/onboarding/qualification"
          style={[styles.nextButton, !isValid && styles.disabledButton]}
          textStyle={styles.nextButtonText}
          onPressStart={handleNext}
          fallbackHref="/onboarding/goal"
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </SafeNavigationButton>
        
        <Text style={styles.stepIndicator}>1/3 단계</Text>
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
