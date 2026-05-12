import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'indigo' | 'orange' | 'emerald' | 'violet';
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  icon,
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getGradientColors = (): [string, string] | null => {
    switch (variant) {
      case 'primary': return ['#0F172A', '#1E293B'];
      case 'secondary': return ['#4F46E5', '#6366F1'];
      case 'indigo': return ['#4F46E5', '#7C3AED'];
      case 'orange': return ['#F59E0B', '#EA580C'];
      case 'emerald': return ['#10B981', '#0D9488'];
      case 'violet': return ['#8B5CF6', '#7C3AED'];
      case 'danger': return ['#F43F5E', '#E11D48'];
      default: return null;
    }
  };

  const gradientColors = getGradientColors();

  const ButtonContent = (
    <View className="flex-row items-center justify-center py-4 px-6 h-[56px]">
        {loading ? (
            <ActivityIndicator color="white" />
        ) : (
            <View className="flex-row items-center">
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`font-black text-base text-center tracking-wide text-white`}>
                {label}
            </Text>
            </View>
        )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={handlePress}
      className={`rounded-3xl overflow-hidden shadow-sm ${variant === 'ghost' ? 'bg-transparent' : ''} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {gradientColors && !disabled ? (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {ButtonContent}
        </LinearGradient>
      ) : (
        <View className={`${variant === 'ghost' ? 'bg-transparent' : 'bg-primary'}`}>
            {ButtonContent}
        </View>
      )}
    </TouchableOpacity>
  );
};
