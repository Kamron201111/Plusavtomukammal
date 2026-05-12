import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RefreshCw, 
  Home, 
  Info, 
  HelpCircle,
  ChevronRight,
  ZoomIn
} from 'lucide-react-native';
import { getImageUrl } from '../utils/imageUrl';
import ImageZoomModal from '../components/ImageZoomModal';

export default function ResultScreen({ navigation, route }: any) {
  const { result } = route.params || {};
  const { t } = useTranslation();
  
  // 🧮 Score Calculations
  const score = result?.score || 0;
  const total = result?.questions_count || 20;
  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 90; 
  
  const answers = result?.attempt_answers || [];
  const [zoomImage, setZoomImage] = React.useState<string | null>(null);

  return (
    <Layout scrollable={true} edges={['top', 'left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">

      {/* 🏆 Header Summary Section */}
      <View className={`items-center pt-20 pb-16 px-6 ${isPassed ? 'bg-emerald-500/5' : 'bg-rose-500/5'}`}>
        <View className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl opacity-50" />
        
        <View className={`w-24 h-24 rounded-[40px] mb-8 items-center justify-center shadow-2xl ${isPassed ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-rose-500 shadow-rose-500/40'}`}>
          {isPassed ? <Trophy color="white" size={48} /> : <XCircle color="white" size={48} />}
        </View>

        <Text className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[4px] mb-2">
            {isPassed ? "Tabriklaymiz!" : "Urinib ko'ring"}
        </Text>
        <Text className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6 tracking-tight px-4 leading-tight">
            {isPassed ? "Imtihon muvaffaqiyatli topshirildi!" : "Imtihondan o'ta olmadingiz"}
        </Text>

        <View className="flex-row items-baseline mb-8">
            <Text className={`text-8xl font-black tracking-tighter ${isPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
                {percentage}
            </Text>
            <Text className="text-2xl font-black text-slate-400 dark:text-slate-500 ml-1">%</Text>
        </View>

        <Text className="text-slate-500 dark:text-slate-400 text-center font-bold px-10 leading-relaxed italic text-xs">
          {isPassed 
            ? "Ajoyib natija! Siz haydovchilik guvohnomasini olishga tayyorsiz." 
            : "Xafa bo'lmang, ko'proq mashq qiling va albatta natijaga erishasiz."}
        </Text>
      </View>

      <View className="px-5 -mt-10">
        {/* 📊 Stats Grid - TMA Premium Style */}
        <View className="bg-white dark:bg-tma-card rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-2xl flex-row justify-around">
            <View className="items-center">
                <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('correct') || "To'g'ri"}</Text>
                <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{score}</Text>
            </View>
            <View className="w-[1px] h-8 bg-slate-100 dark:bg-white/5 mt-3" />
            <View className="items-center">
                <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('wrong') || "Xato"}</Text>
                <Text className="text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">{total - score}</Text>
            </View>
            <View className="w-[1px] h-8 bg-slate-100 dark:bg-white/5 mt-3" />
            <View className="items-center">
                <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('total') || "Jami"}</Text>
                <Text className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{total}</Text>
            </View>
        </View>

        {/* 🎮 Navigation Buttons */}
        <View className="flex-row gap-3 mt-8 mb-12">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.replace('Tickets')}
            className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-5 items-center justify-center flex-row"
          >
            <RefreshCw color="#6366F1" size={18} />
            <Text className="text-indigo-600 dark:text-white font-black text-sm ml-2 uppercase tracking-widest">Qayta</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Home')} 
            className="flex-1 bg-indigo-600 dark:bg-[#6366F1] rounded-2xl py-5 items-center justify-center flex-row shadow-xl shadow-indigo-500/30"
          >
            <Home color="white" size={18} />
            <Text className="text-white font-black text-sm ml-2 uppercase tracking-widest">Asosiy</Text>
          </TouchableOpacity>
        </View>

        {/* 📝 Detailed Attempt Review Cards */}
        <View className="flex-row items-center justify-between mb-6 px-1">
            <Text className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[3px]">
                Natijalarni ko'rib chiqish
            </Text>
            <ChevronRight color="#CBD5E1" size={16} />
        </View>
        
        <View className="pb-10">
            {answers.map((item: any, index: number) => {
                const isCorrect = item.answer?.is_correct;
                const question = item.question;
                const correctAnswer = question?.answers?.find((a: any) => a.is_correct);

                return (
                    <View key={item.id} className="bg-white dark:bg-tma-card rounded-[28px] border border-slate-100 dark:border-white/5 mb-6 overflow-hidden shadow-sm">
                        {/* Header with Visuals */}
                        <View className="flex-row items-center justify-between px-5 py-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                            <View className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1E293B] items-center justify-center">
                                <Text className="text-xs font-black text-slate-600 dark:text-white">{index + 1}</Text>
                            </View>
                            {question?.image_url && (
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    onPress={() => setZoomImage(getImageUrl(question.image_url) || '')}
                                    className="w-16 h-10 rounded-lg bg-slate-100 dark:bg-black/20 overflow-hidden border border-slate-200 dark:border-white/5 relative"
                                >
                                    <Image source={{ uri: getImageUrl(question.image_url) || undefined }} className="w-full h-full" resizeMode="cover" />
                                    <View className="absolute bottom-0 right-0 bg-black/10 rounded-sm">
                                        <ZoomIn color="white" size={8} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View className="p-6">
                            <Text className="text-base font-black text-slate-900 dark:text-white mb-4 leading-tight">
                                {question?.title || question?.content}
                            </Text>

                            {question?.description && (
                                <View className="flex-row gap-3 bg-indigo-500/5 p-4 rounded-2xl mb-6 border border-indigo-500/10">
                                    <Info color="#6366F1" size={16} className="mt-0.5" />
                                    <Text className="flex-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                        {question.description}
                                    </Text>
                                </View>
                            )}

                            {/* User Selected Answer Display */}
                            <View className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'} mb-2`}>
                                <Text className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Sizning javobingiz</Text>
                                {item.answer ? (
                                    <View className="flex-row items-center">
                                        <View className={`w-2 h-2 rounded-full mr-3 ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        <Text className={`flex-1 text-sm font-black ${isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {item.answer.text || item.answer.content}
                                        </Text>
                                        {isCorrect ? <CheckCircle2 color="#10B981" size={18} /> : <XCircle color="#F43F5E" size={18} />}
                                    </View>
                                ) : (
                                    <View className="flex-row items-center">
                                        <HelpCircle color="#94A3B8" size={18} />
                                        <Text className="ml-3 text-sm font-bold text-slate-400 italic">Javob berilmagan</Text>
                                    </View>
                                )}
                            </View>

                            {/* Correct Answer Display (if user was wrong) */}
                            {!isCorrect && correctAnswer && (
                                <View className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Text className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">To'g'ri javob</Text>
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-emerald-500 mr-3" />
                                        <Text className="flex-1 text-sm font-black text-emerald-600 dark:text-emerald-400">
                                            {correctAnswer.text || correctAnswer.content}
                                        </Text>
                                        <CheckCircle2 color="#10B981" size={18} />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
        <View className="h-20" />
      </View>

      <ImageZoomModal 
        visible={!!zoomImage} 
        imageUrl={zoomImage} 
        onClose={() => setZoomImage(null)} 
      />
    </Layout>

  );
}
