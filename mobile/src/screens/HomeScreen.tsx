import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';
import { 
  ClipboardList, 
  Shapes, 
  Split, 
  FileText, 
  UserCircle, 
  Zap, 
  ChevronRight 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AttemptsChart } from '../components/AttemptsChart';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedCount, setSelectedCount] = useState<20 | 50>(20);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [userRes, attemptsRes] = await Promise.all([
        apiClient.get('/user'),
        apiClient.get('/attempts?per_page=5')
      ]);
      
      if (userRes.data.success) {
        setStats(userRes.data.data);
      }
      if (attemptsRes.data.success) {
        setAttempts(attemptsRes.data.data.data || []);
      }
    } catch (error) {
      console.error('Fetch Stats Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    setShowExamModal(false);
    navigation.navigate('ExamMode', { 
        screen: 'ActiveExam', 
        params: { questions_count: selectedCount, ticket_id: null } 
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalScore = stats?.attempts_sum_score ?? 0;
  const totalQuestions = stats?.attempts_sum_questions_count ?? 1;
  const accuracy = Math.round((totalScore / totalQuestions) * 100);

  return (
    <Layout onRefresh={fetchStats} refreshing={loading} edges={['top', 'left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 }}>
        {/* 🌈 Welcome Header */}
        <View className="flex-row items-center justify-between mb-6 px-1 mt-2">
            <View>
                <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {user?.name?.split(' ')[0]}! 👋
                </Text>
                <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                    O'z natijalaringizni tekshiring
                </Text>
            </View>
            <View className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
                {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} className="h-full w-full" />
                ) : (
                    <View className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800">
                        <UserCircle className="h-7 w-7 text-slate-400 dark:text-slate-500" />
                    </View>
                )}
            </View>
        </View>

        {/* 📊 Stats Grid */}
        <View className="flex-row gap-4 mb-4">
            <View className="flex-1 bg-white dark:bg-slate-900/50 rounded-[32px] px-6 py-5 border border-slate-100 dark:border-white/5 relative overflow-hidden shadow-sm dark:shadow-none">
                <View className="flex-1 justify-between">
                    <View>
                        <Text className="text-[12px] font-black text-blue-400 uppercase tracking-[2px]">
                            URINISHLAR
                        </Text>
                        <View className="flex-row items-baseline mt-2">
                            <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                                {stats?.attempts_count || 0}
                            </Text>
                            <Text className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">
                                ta
                            </Text>
                        </View>
                    </View>
                    
                    <View className="mt-8">
                        <View className="flex-row justify-between mb-2 items-center">
                            <Text className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('accuracy')}</Text>
                            <Text className="text-[12px] font-black text-blue-500 dark:text-blue-400">{accuracy}%</Text>
                        </View>
                        <View className="h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                            <LinearGradient
                                colors={['#3B82F6', '#6366F1']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-full rounded-full"
                                style={{ width: `${Math.min(accuracy, 100)}%` }} 
                            />
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => setShowExamModal(true)}
                className="w-[110px] rounded-[32px] overflow-hidden"
            >
                <LinearGradient
                    colors={['#7E22CE', '#6B21A8']}
                    className="flex-1 p-4 justify-between"
                >
                    <View>
                        <Text className="text-[12px] font-black text-white/90 uppercase tracking-widest leading-none">
                            REAL
                        </Text>
                        <Text className="text-[12px] font-black text-white/90 uppercase tracking-widest mt-0.5">
                            IMTIHON
                        </Text>
                        <Text className="text-[11px] font-bold text-white/70 mt-3 leading-tight">
                            20 yoki 50 ta savol
                        </Text>
                    </View>
                    <View className="bg-white/10 rounded-2xl py-2.5 items-center border border-white/10">
                        <Text className="text-[13px] font-black text-white uppercase tracking-widest">Boshlash</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>

        {/* 🏷️ Navigation Categories */}
        <View className="flex-row gap-4 mb-3">
            <ActionCard 
                label="Biletlar"
                icon={<ClipboardList color="white" size={24} />}
                colors={['#F97316', '#EA580C']}
                onPress={() => navigation.navigate('Tickets')}
            />
            <ActionCard 
                label="Yo'l belgilari"
                icon={<Shapes color="white" size={24} />}
                colors={['#10B981', '#059669']}
                onPress={() => navigation.navigate('RulesTab')}
            />
        </View>
        <View className="flex-row gap-4 mb-6">
            <ActionCard 
                label="Yo'l chiziqlari"
                icon={<Split color="white" size={24} />}
                colors={['#A855F7', '#9333EA']}
                onPress={() => navigation.navigate('RulesTab', { screen: 'Lines' })}
            />
            <ActionCard 
                label="Jarimalar"
                icon={<FileText color="white" size={24} />}
                colors={['#EF4444', '#DC2626']}
                onPress={() => navigation.navigate('RulesTab', { screen: 'YHQ' })}
            />
        </View>

        {/* 📈 Charts Section (Natijadorlik) */}
        <View className="bg-white dark:bg-slate-900/50 rounded-[40px] px-6 py-6 border border-slate-100 dark:border-white/5 mb-4 shadow-sm dark:shadow-none">
            <AttemptsChart attempts={stats?.attempts || []} />
        </View>
      </ScrollView>

      {/* 🧩 Real Exam Modal */}
      {showExamModal && (
        <View className="absolute inset-0 z-50 bg-slate-900/40 dark:bg-black/80 items-center justify-center p-6 backdrop-blur-md">
            <View className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5">
                <LinearGradient colors={['#7E22CE', '#6B21A8']} className="p-8 items-center">
                    <Zap color="white" size={32} className="mb-4" />
                    <Text className="text-white text-2xl font-black text-center tracking-tight">Real Imtihon</Text>
                    <Text className="text-white/60 text-sm font-bold text-center mt-2">Savollar sonini tanlang</Text>
                </LinearGradient>

                <View className="p-8">
                    <View className="flex-row gap-4 mb-8">
                        {[20, 50].map((count) => (
                            <TouchableOpacity
                                key={count}
                                onPress={() => setSelectedCount(count as any)}
                                className={`flex-1 p-6 rounded-[32px] border-2 items-center ${
                                    selectedCount === count 
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10' 
                                    : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5'
                                }`}
                            >
                                <Text className={`text-4xl font-black ${selectedCount === count ? 'text-purple-600 dark:text-white' : 'text-slate-400 dark:text-slate-600'}`}>
                                    {count}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity 
                        activeOpacity={0.9} 
                        onPress={handleStartExam}
                        className="w-full bg-purple-600 rounded-[24px] py-4 items-center mb-3"
                    >
                        <Text className="text-white font-black text-sm uppercase tracking-widest">Boshlash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowExamModal(false)} className="w-full py-4 items-center">
                        <Text className="text-slate-500 font-black text-xs uppercase tracking-widest">Bekor qilish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      )}
    </Layout>
  );
}

function ActionCard({ label, icon, colors, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 h-[85px] rounded-[32px] overflow-hidden shadow-2xl"
    >
      <LinearGradient colors={colors} className="flex-1 flex-row items-center px-4 py-3">
        <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center border border-white/20 mr-3">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-sm font-black text-white leading-tight">{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
