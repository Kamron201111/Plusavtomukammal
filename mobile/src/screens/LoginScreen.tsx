import React, { useState } from 'react';
import { View, Text, TextInput, Linking, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const handleOpenTelegram = () => {
    Linking.openURL('https://t.me/PlusAvto.Uz?start=is_android_otp').catch((err) =>
      Alert.alert(t('common.error'), 'Telegramni ochib bo\'lmadi')
    );
  };

  const handleLogin = async () => {
    if (!otp) {
      Alert.alert(t('common.error'), t('auth.otp_label'));
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login-otp', { otp });
      if (response.data.success) {
        await login(response.data.data.token, response.data.data);
      } else {
        Alert.alert(t('common.error'), response.data.message || t('auth.login_error'));
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      // Backend returns errors in { success: false, message: "..." } format
      const serverMessage = error.response?.data?.message;
      const message = serverMessage || t('auth.login_error');
      Alert.alert(t('common.error'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout scrollable={false} edges={['top', 'bottom', 'left', 'right']} className="justify-center">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
          <View className="mb-12 items-center">
            <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                className="w-24 h-24 rounded-[32px] items-center justify-center mb-8 shadow-xl shadow-indigo-500/40"
            >
              <Text className="text-white text-4xl font-black italic tracking-tighter">24</Text>
            </LinearGradient>
            <Text className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center mb-2">
              {t('auth.welcome_title')}
            </Text>
            <Text className="text-base font-medium text-slate-500 text-center px-10 leading-relaxed">
              {t('auth.welcome_desc')}
            </Text>
          </View>

          <View className="bg-white dark:bg-tma-card p-8 rounded-[32px] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-white/5">
            <Button
              label={t('auth.login_btn')}
              onPress={handleOpenTelegram}
              icon={<MessageSquare color="white" size={20} />}
              variant="indigo"
              className="mb-8"
            />

            <View className="mb-8">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4 ml-1">
                {t('auth.otp_label')}
              </Text>
              <TextInput
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-4xl font-black text-center text-slate-900 dark:text-white shadow-inner dark:shadow-none"
                placeholder={t('auth.otp_placeholder')}
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                placeholderTextColor="#CBD5E1"
                autoFocus={true}
              />
            </View>

            <Button
              label={t('auth.login_submit')}
              onPress={handleLogin}
              loading={loading}
              disabled={!otp}
              variant="primary"
            />
          </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

