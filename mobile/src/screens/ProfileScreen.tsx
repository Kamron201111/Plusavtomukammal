import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Switch } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { LogOut, User as UserIcon, Globe, Check, X, Moon, Sun, ChevronRight, ZoomIn } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import ImageZoomModal from '../components/ImageZoomModal';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useColorScheme();
  
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const languages = [
    { code: 'uz', name: 'O\'zbekcha' },
    { code: 'ru', name: 'Русский' },
    { code: 'krill', name: 'Ўзбекча (Кирилл)' },
    { code: 'en', name: 'English' },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangModalVisible(false);
  };

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Layout scrollable={true} edges={['top', 'left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 👤 Profile Header */}
        <View className="items-center pt-12 pb-10">
            <View className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl opacity-30" />
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => user?.avatar && setZoomImage(user.avatar)}
                className="w-28 h-28 rounded-[40px] bg-white dark:bg-tma-card items-center justify-center mb-5 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden"
            >
                <View className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                {user?.avatar ? (
                    <>
                        <Image source={{ uri: user.avatar }} className="w-full h-full" />
                        <View className="absolute bottom-2 right-2 bg-black/20 rounded-full p-1.5">
                            <ZoomIn color="white" size={14} />
                        </View>
                    </>
                ) : (
                    <UserIcon color="#4F46E5" size={48} />
                )}
            </TouchableOpacity>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center px-6">
                {user?.name || t('tabs.profile')}
            </Text>
            <Text className="text-indigo-500 dark:text-indigo-400 font-black uppercase text-[9px] tracking-[4px] mt-2">
                @{user?.username || 'user'}
            </Text>
        </View>


        {/* 📊 Stats Section */}
        <View className="px-6 flex-row gap-3 mb-8">
            <View className="flex-1 bg-white dark:bg-tma-card rounded-[24px] p-4 border border-slate-100 dark:border-white/5 items-center">
                <Text className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</Text>
                <Text className="text-lg font-black text-emerald-600 dark:text-emerald-400 italic">PREMIUM</Text>
            </View>
            <View className="flex-1 bg-white dark:bg-tma-card rounded-[24px] p-4 border border-slate-100 dark:border-white/5 items-center">
                <Text className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Sizning ID</Text>
                <Text className="text-lg font-black text-slate-900 dark:text-white tabular-nums">#{user?.id || '0'}</Text>
            </View>
        </View>

        {/* ⚙️ Settings Section */}
        <View className="px-6 mb-8">
            <Text className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4 ml-2">Sozlamalar</Text>
            <View className="bg-white dark:bg-tma-card rounded-[28px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                {/* Language Toggle */}
                <TouchableOpacity 
                    onPress={() => setLangModalVisible(true)}
                    activeOpacity={0.7}
                    className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-xl bg-indigo-500/10 items-center justify-center mr-4">
                            <Globe color="#6366F1" size={20} />
                        </View>
                        <Text className="text-slate-900 dark:text-slate-200 font-black">Ilova tili</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-slate-400 dark:text-slate-500 font-bold mr-2">
                            {languages.find(l => l.code === i18n.language)?.name || i18n.language}
                        </Text>
                        <ChevronRight color="#CBD5E1" size={18} />
                    </View>
                </TouchableOpacity>

                {/* Theme Toggle */}
                <View className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-xl bg-amber-500/10 items-center justify-center mr-4">
                            {colorScheme === 'dark' ? <Moon color="#F59E0B" size={20} /> : <Sun color="#F59E0B" size={20} />}
                        </View>
                        <Text className="text-slate-900 dark:text-slate-200 font-black">Tungi rejim</Text>
                    </View>
                    <Switch
                        value={colorScheme === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
                        thumbColor={colorScheme === 'dark' ? '#FFFFFF' : '#F4F4F5'}
                    />
                </View>

                {/* Info Rows */}
                <View className="px-6 py-5 flex-row items-center justify-between">
                    <Text className="text-slate-500 font-bold text-xs uppercase tracking-widest pl-2">Versiya</Text>
                    <Text className="font-black text-slate-300 dark:text-slate-600">v1.2.4</Text>
                </View>
            </View>
        </View>

        {/* 🚪 Logout */}
        <View className="px-6">
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={logout}
                className="w-full bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded-[24px] py-5 flex-row items-center justify-center"
            >
                <LogOut color="#F43F5E" size={20} />
                <Text className="text-rose-600 dark:text-rose-500 font-black text-sm uppercase tracking-[2px] ml-3">Tizimdan chiqish</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🎌 Language Selector Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
      >
        <View className="flex-1 bg-black/80 justify-end">
            <View className="bg-white dark:bg-tma-card rounded-t-[40px] p-8 border-t border-slate-100 dark:border-white/10">
                <View className="flex-row items-center justify-between mb-8">
                    <Text className="text-slate-900 dark:text-white text-2xl font-black">Tilni tanlang</Text>
                    <TouchableOpacity onPress={() => setLangModalVisible(false)} className="bg-slate-100 dark:bg-white/5 p-2 rounded-full">
                        <X color={colorScheme === 'dark' ? 'white' : '#0F172A'} size={24} />
                    </TouchableOpacity>
                </View>
                
                <View className="gap-3 mb-10">
                    {languages.map((l) => {
                        const isSelected = i18n.language === l.code;
                        return (
                            <TouchableOpacity
                                key={l.code}
                                onPress={() => changeLanguage(l.code)}
                                className={`p-5 rounded-2xl flex-row items-center justify-between ${
                                    isSelected ? 'bg-indigo-600' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5'
                                }`}
                            >
                                <Text className={`font-black text-lg ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {l.name}
                                </Text>
                                {isSelected && <Check color="white" size={24} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
      </Modal>

      <ImageZoomModal 
        visible={!!zoomImage} 
        imageUrl={zoomImage} 
        onClose={() => setZoomImage(null)} 
      />
    </Layout>


  );
}
