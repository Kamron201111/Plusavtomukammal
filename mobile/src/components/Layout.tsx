import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  className?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  scrollable = true,
  onRefresh,
  refreshing = false,
  className = '',
  edges = ['top', 'left', 'right'],
}) => {
  const content = (
    <View className={`flex-1 p-4 ${className}`}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-slate-50 dark:bg-tma-bg">
      {scrollable ? (
        <ScrollView
          className="flex-1 bg-slate-50 dark:bg-tma-bg"
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366F1']} tintColor="#6366F1" />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        <View className="flex-1 bg-slate-50 dark:bg-tma-bg">
            {content}
        </View>
      )}
    </SafeAreaView>
  );
};
