import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/Layout';
import { Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, useColorScheme as useRNColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient from '../api/client';
import { useColorScheme } from 'nativewind';
import { ChevronDown, ChevronUp, ZoomIn, Wallet, AlertCircle, Info, Landmark } from 'lucide-react-native';
import ImageZoomModal from '../components/ImageZoomModal';

import { getImageUrl } from '../utils/imageUrl';

const TopTab = createMaterialTopTabNavigator();

const formatPrice = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

function AccordionItem({ title, children, isOpen, onToggle }: any) {
    return (
        <View className="mb-4 bg-white dark:bg-tma-card rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-2xl">
            <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={onToggle}
                className="flex-row items-center justify-between p-6"
            >
                <Text className="flex-1 text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    {title}
                </Text>
                <View className="bg-slate-50 dark:bg-white/5 p-2 rounded-full">
                    {isOpen ? <ChevronUp color="#6366F1" size={20} /> : <ChevronDown color="#6366F1" size={20} />}
                </View>
            </TouchableOpacity>
            {isOpen && <View className="p-5 pt-0">{children}</View>}
        </View>
    );
}

function ContentList({ endpoint, onImagePress }: { endpoint: string, onImagePress: (url: string) => void }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(endpoint);
      if (response.data.success) {
        let result = response.data.data;
        if (endpoint === '/yhq' && result?.categories) {
            result = result.categories;
        }
        setData(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error(`Fetch ${endpoint} Error:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  if (loading) {
    return (
        <View className="flex-1 items-center justify-center p-20 bg-slate-50 dark:bg-tma-bg">
            <ActivityIndicator color="#6366F1" size="large" />
            <Text className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4">Yuklanmoqda...</Text>
        </View>
    );
  }

  // 📂 Signs (SignCategory) and YHQ (Fines) use an accordion
  if (endpoint === '/sign_category' || endpoint === '/yhq') {
      return (
        <Layout scrollable={false} edges={['left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">
            <FlatList
                data={data}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <AccordionItem 
                        title={item.name || item.title} 
                        isOpen={expandedCategoryId === item.id}
                        onToggle={() => setExpandedCategoryId(expandedCategoryId === item.id ? null : item.id)}
                    >
                        {/* 🚦 Render Signs */}
                        {endpoint === '/sign_category' && item.signs?.map((sign: any) => (
                            <TouchableOpacity 
                                key={sign.id} 
                                className="mb-4 bg-slate-50 dark:bg-white/5 p-4 rounded-[22px] flex-row items-center border border-slate-100 dark:border-white/5"
                                activeOpacity={0.8}
                                onPress={() => sign.image_url && onImagePress(getImageUrl(sign.image_url) || '')}
                            >
                                {sign.image_url && (
                                    <View className="w-16 h-16 rounded-[16px] bg-white items-center justify-center mr-4 p-2 relative">
                                        <Image 
                                            source={{ uri: getImageUrl(sign.image_url) || undefined }} 
                                            className="w-full h-full"
                                            resizeMode="contain"
                                        />
                                        <View className="absolute top-1 right-1 bg-indigo-500/10 rounded-full p-1">
                                            <ZoomIn color="#6366F1" size={8} />
                                        </View>
                                    </View>
                                )}
                                <View className="flex-1">
                                    <Text className="text-sm font-black text-slate-900 dark:text-white mb-1">
                                        {sign.content || sign.title || sign.name}
                                    </Text>
                                    {sign.description && (
                                        <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight" numberOfLines={2}>
                                            {sign.description}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* 💰 Render Fines (YHQ) */}
                        {endpoint === '/yhq' && item.items?.map((clause: any) => (
                            <View 
                                key={clause.id} 
                                className="mb-4 bg-slate-50 dark:bg-white/5 p-5 rounded-[28px] border border-slate-100 dark:border-white/5"
                            >
                                <Text className="text-[15px] font-black text-slate-900 dark:text-white mb-4 leading-snug">
                                    {clause.name || clause.title || clause.content}
                                </Text>
                                
                                <View className="flex-row flex-wrap gap-2 mb-4">
                                    {clause.summa > 0 && (
                                        <View className="w-[31%] bg-white dark:bg-tma-card p-2 rounded-2xl border border-slate-100 dark:border-white/5 items-center">
                                            <View className="flex-row items-center mb-1">
                                                <Wallet color="#10B981" size={10} />
                                                <Text className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Summa</Text>
                                            </View>
                                            <Text className="text-[10px] font-black text-slate-900 dark:text-white tabular-nums">{formatPrice(clause.summa)}</Text>
                                        </View>
                                    )}
                                    {clause.summa_min > 0 && (
                                        <View className="w-[31%] bg-white dark:bg-tma-card p-2 rounded-2xl border border-slate-100 dark:border-white/5 items-center">
                                            <View className="flex-row items-center mb-1">
                                                <ChevronDown color="#6366F1" size={10} />
                                                <Text className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Min</Text>
                                            </View>
                                            <Text className="text-[10px] font-black text-slate-900 dark:text-white tabular-nums">{formatPrice(clause.summa_min)}</Text>
                                        </View>
                                    )}
                                    {clause.summa_max > 0 && (
                                        <View className="w-[31%] bg-white dark:bg-tma-card p-2 rounded-2xl border border-slate-100 dark:border-white/5 items-center">
                                            <View className="flex-row items-center mb-1">
                                                <ChevronUp color="#F43F5E" size={10} />
                                                <Text className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Max</Text>
                                            </View>
                                            <Text className="text-[10px] font-black text-slate-900 dark:text-white tabular-nums">{formatPrice(clause.summa_max)}</Text>
                                        </View>
                                    )}
                                    {clause.discount_summa > 0 && (
                                        <View className="w-[31%] bg-white dark:bg-tma-card p-2 rounded-2xl border border-slate-100 dark:border-white/5 items-center">
                                            <View className="flex-row items-center mb-1">
                                                <Landmark color="#10B981" size={10} />
                                                <Text className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Chegirma</Text>
                                            </View>
                                            <Text className="text-[10px] font-black text-emerald-500 tabular-nums">{formatPrice(clause.discount_summa)}</Text>
                                        </View>
                                    )}
                                    {clause.bhm > 0 && (
                                        <View className="w-[31%] bg-white dark:bg-tma-card p-2 rounded-2xl border border-slate-100 dark:border-white/5 items-center">
                                            <View className="flex-row items-center mb-1">
                                                <Info color="#3B82F6" size={10} />
                                                <Text className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">BHM</Text>
                                            </View>
                                            <Text className="text-[11px] font-black text-slate-900 dark:text-white">x{clause.bhm}</Text>
                                        </View>
                                    )}
                                    {clause.penalty_points > 0 && (
                                        <View className="w-[31%] bg-white dark:bg-tma-card p-2 rounded-2xl border border-slate-100 dark:border-white/5 items-center">
                                            <View className="flex-row items-center mb-1">
                                                <AlertCircle color="#F59E0B" size={10} />
                                                <Text className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Ball</Text>
                                            </View>
                                            <Text className="text-[11px] font-black text-slate-900 dark:text-white">{clause.penalty_points}</Text>
                                        </View>
                                    )}
                                </View>

                                {clause.description && (
                                    <View className="flex-row gap-3 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10 mb-3">
                                        <Info color="#6366F1" size={14} className="mt-0.5" />
                                        <Text className="flex-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                            {clause.description}
                                        </Text>
                                    </View>
                                )}

                                {clause.additional_penalty && (
                                    <View className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                                        <Text className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest text-center">
                                            ⚠️ {clause.additional_penalty}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </AccordionItem>
                )}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center py-20">
                      <Text className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs">Ma'lumot topilmadi</Text>
                    </View>
                  )}
            />
        </Layout>
      );
  }

  // 📏 Road Lines use standard flat list
  return (
    <Layout scrollable={false} edges={['left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">
      <FlatList
        data={data}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View 
            className="mb-6 bg-white dark:bg-tma-card rounded-[28px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-2xl"
          >
            <View className="p-5">
              <View className="flex-row items-center mb-4">
                {item.image_url && (
                    <TouchableOpacity 
                        onPress={() => onImagePress(getImageUrl(item.image_url) || '')}
                        activeOpacity={0.9}
                        className="w-20 h-20 rounded-[18px] bg-slate-50 dark:bg-white/[0.03] mr-4 items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5 p-2"
                    >
                        <Image 
                            source={{ uri: getImageUrl(item.image_url) || undefined }} 
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                        <View className="absolute bottom-1 right-1">
                            <ZoomIn color="#6366F1" size={12} />
                        </View>
                    </TouchableOpacity>
                )}
                <Text className="flex-1 text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {item.title || item.name}
                </Text>
              </View>

              <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                  {item.description || item.content || item.text}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-20">
            <Text className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs">Ma'lumot topilmadi</Text>
          </View>
        )}
      />
    </Layout>
  );
}

export default function RulesScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  return (
    <>
        <TopTab.Navigator
        screenOptions={{
            tabBarActiveTintColor: '#6366F1',
            tabBarInactiveTintColor: colorScheme === 'dark' ? '#475569' : '#94A3B8',
            tabBarIndicatorStyle: { backgroundColor: '#6366F1', height: 4, borderRadius: 2 },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
            tabBarStyle: { 
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF', 
                borderBottomWidth: 1, 
                borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                paddingTop: insets.top + 8,
                elevation: 0,
                shadowOpacity: 0 
            },
        }}
        >
        <TopTab.Screen name="YHQ" options={{ title: t('rules.yhq') }}>
            {() => <ContentList endpoint="/yhq" onImagePress={setZoomImage} />}
        </TopTab.Screen>
        <TopTab.Screen name="Signs" options={{ title: t('rules.signs') }}>
            {() => <ContentList endpoint="/sign_category" onImagePress={setZoomImage} />}
        </TopTab.Screen>
        <TopTab.Screen name="Lines" options={{ title: t('rules.lines') }}>
            {() => <ContentList endpoint="/road_line" onImagePress={setZoomImage} />}
        </TopTab.Screen>
        </TopTab.Navigator>

        <ImageZoomModal 
            visible={!!zoomImage} 
            imageUrl={zoomImage} 
            onClose={() => setZoomImage(null)} 
        />
    </>
  );
}


