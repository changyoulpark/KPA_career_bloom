import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';

interface SafeLinkProps {
  href: string;
  style?: any;
  children: React.ReactNode;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  fallbackHref?: string;
  disabled?: boolean;
}

export function SafeLink({ 
  href, 
  style, 
  children, 
  onPressStart,
  onPressEnd,
  fallbackHref = '/',
  disabled = false 
}: SafeLinkProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePress = async () => {
    if (disabled || isNavigating) return;

    try {
      setIsNavigating(true);
      onPressStart?.();
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Validate route exists (basic check)
      if (!href || href.trim() === '') {
        throw new Error('Invalid route provided');
      }

    } catch (error) {
      console.error('Navigation error:', error);
      
      Alert.alert(
        '네비게이션 오류',
        '페이지로 이동할 수 없습니다. 홈으로 이동하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '홈으로 이동', 
            onPress: () => {
              try {
                window.location.href = fallbackHref;
              } catch (fallbackError) {
                console.error('Fallback navigation error:', fallbackError);
              }
            }
          }
        ]
      );
    } finally {
      setIsNavigating(false);
      onPressEnd?.();
    }
  };

  if (isNavigating) {
    return (
      <TouchableOpacity style={[style, styles.loadingButton]} disabled>
        <ActivityIndicator size="small" color="white" style={styles.loadingIcon} />
        <Text style={styles.loadingText}>이동 중...</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Link 
      href={href} 
      style={style}
      onPress={handlePress}
      asChild={false}
    >
      {children}
    </Link>
  );
}

interface SafeNavigationButtonProps {
  href: string;
  style?: any;
  textStyle?: any;
  children: React.ReactNode;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  fallbackHref?: string;
  disabled?: boolean;
}

export function SafeNavigationButton({
  href,
  style,
  textStyle,
  children,
  onPressStart,
  onPressEnd,
  fallbackHref = '/',
  disabled = false
}: SafeNavigationButtonProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePress = async () => {
    if (disabled || isNavigating) return;

    try {
      setIsNavigating(true);
      onPressStart?.();
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Validate route exists (basic check)
      if (!href || href.trim() === '') {
        throw new Error('Invalid route provided');
      }

      // Try to navigate
      router.push(href);

    } catch (error) {
      console.error('Navigation error:', error);
      
      Alert.alert(
        '네비게이션 오류',
        '페이지로 이동할 수 없습니다. 홈으로 이동하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '홈으로 이동', 
            onPress: () => {
              try {
                router.replace(fallbackHref);
              } catch (fallbackError) {
                console.error('Fallback navigation error:', fallbackError);
                // Last resort - try to reload page
                if (typeof window !== 'undefined') {
                  window.location.href = fallbackHref;
                }
              }
            }
          }
        ]
      );
    } finally {
      setIsNavigating(false);
      onPressEnd?.();
    }
  };

  return (
    <TouchableOpacity
      style={[style, isNavigating && styles.loadingButton]}
      onPress={handlePress}
      disabled={disabled || isNavigating}
    >
      {isNavigating ? (
        <>
          <ActivityIndicator size="small" color="white" style={styles.loadingIcon} />
          <Text style={[textStyle, styles.loadingText]}>이동 중...</Text>
        </>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loadingButton: {
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});