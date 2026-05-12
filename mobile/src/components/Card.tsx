import React from 'react';
import { View, Text } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  contentContainerClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  contentContainerClassName = '',
}) => {
  return (
    <View className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 mb-4 overflow-hidden ${className}`}>
      {title && (
        <View className="px-5 py-4 border-b border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/50">
          <Text className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
            {title}
          </Text>
        </View>
      )}
      <View className={`${contentContainerClassName}`}>
        {children}
      </View>
    </View>
  );
};
