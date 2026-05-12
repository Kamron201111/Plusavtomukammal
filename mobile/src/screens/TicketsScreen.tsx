import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Layout } from '../components/Layout';
import apiClient from '../api/client';
import { useTranslation } from 'react-i18next';
import { Layers, ChevronRight, ChevronLeft } from 'lucide-react-native';

export default function TicketsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTickets = async (pageNo = 1, isRefresh = false) => {
    if (pageNo > 1 && !hasMore) return;

    try {
      if (isRefresh || pageNo === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await apiClient.get('/tickets', {
        params: {
          page: pageNo,
          per_page: 20
        }
      });

      if (response.data.success) {
        const newData = response.data.data?.data || response.data.data || [];
        const meta = response.data.data?.meta || response.data.meta;
        
        // Logic to determine if there are more pages
        // If meta exists, use it, otherwise check data length vs per_page
        const moreAvailable = meta 
          ? meta.current_page < meta.last_page 
          : newData.length === 20;

        if (isRefresh || pageNo === 1) {
          setTickets(newData);
          setPage(1);
        } else {
          setTickets(prev => [...prev, ...newData]);
          setPage(pageNo);
        }
        
        setHasMore(moreAvailable);
      }
    } catch (error) {
      console.error('Fetch Tickets Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTickets(1, true);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchTickets(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchTickets(page + 1, false);
    }
  };

  const renderTicket = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ExamMode', { 
            screen: 'ActiveExam',
            params: {
              ticket_id: item.id, 
              ticket_title: item.title 
            }
        })}
        className="flex-1 m-2 p-5 bg-white dark:bg-tma-card rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm dark:shadow-2xl relative overflow-hidden"
      >
        <View className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />

        <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
                <Layers color="#6366F1" size={14} strokeWidth={3} />
                <View className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </View>
            <View className="bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <Text className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tabular-nums">
                    {item.attempts_count} {t('attempt')}
                </Text>
            </View>
        </View>

        <Text className="text-base font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            {item.title || `${t('ticket')} #${String(index + 1).padStart(2, '0')}`}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return <View className="h-20" />;
    return (
      <View className="py-8 items-center justify-center">
        <ActivityIndicator color="#6366F1" />
      </View>
    );
  };

  return (
    <Layout scrollable={false} edges={['top', 'left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">
      <View className="px-5 pt-8 pb-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
            <ChevronLeft color="#6366F1" size={24} strokeWidth={3} />
            <View className="ml-3">
                <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('sidebar.ticket')}</Text>
                <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    Bilimingizni sinash biletlari
                </Text>
            </View>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
            <View className="py-20 items-center justify-center opacity-50">
              <Layers color="#475569" size={60} />
              <Text className="text-slate-400 dark:text-slate-500 font-black mt-4 uppercase tracking-[3px] text-center px-10">Biletlar topilmadi</Text>
            </View>
          ) : null
        }
      />
    </Layout>
  );
}
