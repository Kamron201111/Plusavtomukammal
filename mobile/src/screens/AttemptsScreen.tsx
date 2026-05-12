import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/client';
import { Zap, Clock, Award } from 'lucide-react-native';

export default function AttemptsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAttempts = async (pageNo = 1, isRefresh = false) => {
    if (pageNo > 1 && !hasMore) return;

    try {
      if (isRefresh || pageNo === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await apiClient.get('/attempts', {
        params: {
          page: pageNo,
          per_page: 20
        }
      });

      if (response.data.success) {
        const newData = response.data.data?.data || response.data.data || [];
        const meta = response.data.data?.meta || response.data.meta;
        
        const moreAvailable = meta 
          ? meta.current_page < meta.last_page 
          : newData.length === 20;

        if (isRefresh || pageNo === 1) {
          setAttempts(newData);
          setPage(1);
        } else {
          setAttempts(prev => [...prev, ...newData]);
          setPage(pageNo);
        }
        
        setHasMore(moreAvailable);
      }
    } catch (error) {
      console.error('Fetch Attempts Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAttempts(1, true);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchAttempts(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchAttempts(page + 1, false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSuccess = item.score >= (item.questions_count * 0.9);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeTab', { 
            screen: 'Result', 
            params: { result: item } 
        })}
        activeOpacity={0.8}
        className="bg-white dark:bg-tma-card rounded-[28px] p-6 border border-slate-100 dark:border-white/5 flex-row items-center shadow-sm mb-4"
      >
        <View className={`w-14 h-14 rounded-2xl items-center justify-center ${
          isSuccess ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }`}>
          {isSuccess ? <Award color="#10B981" size={24} /> : <Zap color="#F43F5E" size={24} />}
        </View>
        
        <View className="ml-4 flex-1">
          <Text className="text-slate-900 dark:text-white font-black text-base">
            {item.ticket?.title ? `${t('ticket')} #${item.ticket.id}` : t('real_exam.title')}
          </Text>
          <View className="flex-row items-center mt-1.5">
            <Clock color="#94A3B8" size={12} />
            <Text className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest ml-1.5">
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className={`text-2xl font-black tabular-nums ${
            isSuccess ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            {item.score}/{item.questions_count}
          </Text>
          <Text className="text-slate-400 dark:text-slate-600 font-black text-[9px] uppercase tracking-widest mt-1">
            Natija
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return <View className="h-10" />;
    return (
      <View className="py-8 items-center justify-center">
        <ActivityIndicator color="#6366F1" />
      </View>
    );
  };

  return (
    <Layout scrollable={false} edges={['top', 'left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">
      <FlatList
        data={attempts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <View className="mb-8">
            <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('exam_attempts.title')}
            </Text>
            <Text className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 leading-tight">
                Barcha topshirilgan imtihonlar ro'yxati
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl 
            refreshing={loading && page === 1} 
            onRefresh={handleRefresh} 
            tintColor="#6366F1" 
            colors={['#6366F1']} 
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="mt-20 items-center justify-center p-10 bg-white dark:bg-tma-card rounded-[32px] border border-dashed border-slate-200 dark:border-white/5">
              <Text className="text-slate-400 font-black text-xs uppercase tracking-widest text-center leading-relaxed">
                Hozircha urinishlar mavjud emas.{'\n'}Boshlash uchun biletlarni tanlang.
              </Text>
            </View>
          ) : null
        }
      />
    </Layout>
  );
}
