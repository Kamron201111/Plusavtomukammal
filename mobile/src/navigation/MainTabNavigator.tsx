import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, User, BookOpen, History } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeStackNavigator from './HomeStackNavigator';
import RulesScreen from '../screens/RulesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AttemptsScreen from '../screens/AttemptsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const tabBarBottomPad = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: isDark ? '#475569' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDark ? '#020617' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          height: 56 + tabBarBottomPad,
          paddingBottom: tabBarBottomPad,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0
        },
        tabBarLabelStyle: {
          fontWeight: '900',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginTop: 2
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('HomeTab', { screen: 'Home' });
          },
        })}
      />
      <Tab.Screen
        name="AttemptsTab"
        component={AttemptsScreen}
        options={{
          tabBarLabel: t('tabs.attempts'),
          tabBarIcon: ({ color }) => <History color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="RulesTab"
        component={RulesScreen}
        options={{
          tabBarLabel: t('tabs.rules'),
          tabBarIcon: ({ color }) => <BookOpen color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />
    </Tab.Navigator>
  );
}
