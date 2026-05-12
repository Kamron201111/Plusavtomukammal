import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActiveExamScreen from '../screens/ActiveExamScreen';

const Stack = createNativeStackNavigator();

export default function ExamStackNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen name="ActiveExam" component={ActiveExamScreen} />
    </Stack.Navigator>
  );
}
