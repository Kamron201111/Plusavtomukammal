import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Dimensions, Modal } from 'react-native';
import { Layout } from '../components/Layout';
import apiClient from '../api/client';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Zap, Info, X, ZoomIn } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { getImageUrl } from '../utils/imageUrl';
import ImageZoomModal from '../components/ImageZoomModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ActiveExamScreen({ navigation, route }: any) {
  const { ticket_id, ticket_title, questions_count = 20 } = route.params || {};
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [showDescription, setShowDescription] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);


  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 0) {
                clearInterval(timer);
                finishExam();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [attempt]);

  const startExam = async () => {
    try {
      setLoading(true);
      const payload = ticket_id ? { ticket_id } : { questions_count };
      const response = await apiClient.post('/attempts', payload);
      if (response.data.success) {
        setAttempt(response.data.data);
        setQuestions(response.data.data.attempt_answers || []);
      }
    } catch (error) {
      console.error('Start Exam Error:', error);
      Alert.alert(t('error'), 'Imtihonni boshlab bo\'lmadi');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startExam();
  }, []);

  const handleAnswerSelect = async (answerId: number) => {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion.selected_answer_id) return; 

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].selected_answer_id = answerId;
    setQuestions(updatedQuestions);

    try {
      await apiClient.put(`/attempt_answers/${currentQuestion.id}`, {
        answer_id: answerId
      });
      
      // Auto move after short delay for better UX
      if (currentIndex < questions.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 600);
      }
    } catch (error) {
      console.error('Submit Answer Error:', error);
    }
  };

  const finishExam = async () => {
    if (!attempt) return;
    try {
      setSubmitting(true);
      const response = await apiClient.post(`/attempts/${attempt.id}/submit`);
      if (response.data.success) {
        navigation.replace('HomeTab', { 
            screen: 'Result', 
            params: { result: response.data.data } 
        });
      }
    } catch (error) {
      console.error('Finish Exam Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 📏 Layout Calculations for 10 items fit
  const MARGINS = 16 * 2; // m-4 on both sides
  const PADDING = 16 * 2; // p-4 on both sides
  const containerPadding = MARGINS + PADDING; 
  const gap = 6;
  const itemWidth = (SCREEN_WIDTH - containerPadding - (9 * gap)) / 10;

  // 🔄 Auto-scroll to active question
  useEffect(() => {
    if (scrollRef.current) {
        const scrollToX = Math.max(0, (currentIndex * (itemWidth + gap)) - (SCREEN_WIDTH / 2) + (itemWidth / 2) + 32);
        scrollRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  }, [currentIndex, itemWidth]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#020617]">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">{t('loading')}</Text>
      </View>
    );
  }

  const currentQA = questions[currentIndex];
  const question = currentQA?.question;
  const isAnswered = !!currentQA?.selected_answer_id;


  return (
    <Layout scrollable={false} edges={['top', 'bottom', 'left', 'right']} className="p-0 bg-slate-50 dark:bg-tma-bg">
      {/* 🏁 Header Module */}
      <View className="bg-white dark:bg-tma-card m-4 mt-2 rounded-[24px] p-4 shadow-sm dark:shadow-2xl border border-slate-100 dark:border-white/5">
        <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center flex-1 mr-2">
                <ChevronLeft color="#6366F1" size={20} />
                <Text className="text-slate-900 dark:text-white font-black ml-1 text-[13px] lowercase tracking-tight" numberOfLines={1}>
                    {ticket_title || (ticket_id ? `${t('ticket')} #${ticket_id}` : t('real_exam.title'))}
                </Text>
            </TouchableOpacity>
            
            <View className="bg-slate-100 dark:bg-[#1E293B] px-3 py-1.5 rounded-xl flex-row items-center border border-slate-200 dark:border-white/5">
                <Text className="text-slate-900 dark:text-white font-black tabular-nums mr-1.5 text-xs">
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                    {String(timeLeft % 60).padStart(2, '0')}
                </Text>
                <Zap color="#F59E0B" size={12} fill="#F59E0B" />
            </View>
        </View>

        <ScrollView 
            ref={scrollRef}
            horizontal 
            scrollEnabled={questions.length > 10}
            showsHorizontalScrollIndicator={false}
            className="flex-none"
            contentContainerStyle={{ paddingRight: questions.length > 10 ? 20 : 0 }}
        >
            {questions.map((q, index) => {
                const isCurrent = index === currentIndex;
                const selId = q.selected_answer_id;
                const isCorrect = selId ? q.question?.answers?.find((a: any) => a.id === selId)?.is_correct : null;
                
                let bgColor = 'bg-slate-100 dark:bg-slate-800/40';
                let textColor = 'text-slate-400 dark:text-slate-500';
                let borderColor = isCurrent ? 'border-indigo-600 dark:border-indigo-500' : 'border-transparent';

                if (selId) {
                    if (isCorrect) {
                        bgColor = 'bg-emerald-500';
                        textColor = 'text-white';
                    } else {
                        bgColor = 'bg-rose-500';
                        textColor = 'text-white';
                    }
                } else if (isCurrent) {
                    bgColor = 'bg-indigo-50 dark:bg-indigo-500/10';
                    textColor = 'text-indigo-600 dark:text-indigo-400';
                }

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setCurrentIndex(index)}
                        style={{ width: itemWidth, height: itemWidth }}
                        className={`rounded-xl items-center justify-center mr-1.5 border-2 ${bgColor} ${borderColor}`}
                    >
                        <Text className={`font-black text-[11px] ${textColor}`}>
                            {index + 1}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Question Image */}
        {question?.image_url && (
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => setZoomImage(getImageUrl(question.image_url))}
                className="w-full aspect-[16/10] rounded-[24px] overflow-hidden mb-4 bg-white dark:bg-tma-card border border-slate-100 dark:border-white/5 shadow-sm relative"
            >
                <Image 
                    source={{ uri: getImageUrl(question.image_url) || undefined }} 
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute bottom-3 right-3 bg-black/20 rounded-full p-2">
                    <ZoomIn color="white" size={20} />
                </View>
            </TouchableOpacity>
        )}

        {/* Question Title & Info */}
        <View className="flex-row items-start justify-between mb-6 px-1">
            <Text className="flex-1 text-lg font-black text-slate-900 dark:text-white leading-tight mr-3">
                {question?.title || question?.content}
            </Text>
            {question?.description && (
                <TouchableOpacity 
                    onPress={() => setShowDescription(true)}
                    className="p-2 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full border border-indigo-500/10 dark:border-indigo-500/20"
                >
                    <Info color="#6366F1" size={18} />
                </TouchableOpacity>
            )}
        </View>

        {/* Answers List */}
        <View className="pb-10">
          {question?.answers?.map((answer: any) => {
            const isSelected = currentQA?.selected_answer_id === answer.id;
            const showsCorrectness = isAnswered;
            
            let itemBg = 'bg-white dark:bg-tma-card';
            let itemBorder = 'border-slate-100 dark:border-white/5';
            let indicatorBg = 'border-slate-200 dark:border-slate-700 bg-transparent';
            let textColor = 'text-slate-800 dark:text-slate-100';

            if (isSelected) {
                if (answer.is_correct) {
                    itemBg = 'bg-emerald-500/5 dark:bg-emerald-500/10';
                    itemBorder = 'border-emerald-500/20 dark:border-emerald-500/30';
                    indicatorBg = 'bg-emerald-500 border-emerald-500';
                } else {
                    itemBg = 'bg-rose-500/5 dark:bg-rose-500/10';
                    itemBorder = 'border-rose-500/20 dark:border-rose-500/30';
                    indicatorBg = 'bg-rose-500 border-rose-500';
                }
            } else if (showsCorrectness && answer.is_correct) {
                // Flash the correct answer even if not selected
                itemBg = 'bg-emerald-500/5';
                itemBorder = 'border-emerald-500/20';
                indicatorBg = 'border-emerald-500/40 bg-transparent';
            }

            return (
              <TouchableOpacity
                key={answer.id}
                activeOpacity={0.7}
                onPress={() => handleAnswerSelect(answer.id)}
                className={`p-4 rounded-[20px] mb-3 border flex-row items-center ${itemBg} ${itemBorder}`}
              >
                <View className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${indicatorBg}`}>
                  {(isSelected || (showsCorrectness && answer.is_correct)) && <View className="w-1.5 h-1.5 bg-white rounded-full" />}
                </View>
                <Text className={`flex-1 text-[15px] font-bold leading-snug ${textColor}`}>
                  {answer.text || answer.content}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 🚀 Navigation Footer */}
      <View className="px-6 py-4 bg-white dark:bg-tma-bg border-t border-slate-100 dark:border-white/5 flex-row items-center gap-3">

        {currentIndex > 0 && (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentIndex(currentIndex - 1)}
                className="w-14 h-14 bg-[#1E293B] rounded-2xl items-center justify-center border border-white/5"
            >
                <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
        )}
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={currentIndex === questions.length - 1 ? finishExam : () => setCurrentIndex(currentIndex + 1)}
            disabled={submitting}
            className="flex-1 bg-[#7C3AED] rounded-2xl h-14 items-center justify-center flex-row shadow-2xl shadow-indigo-600/40"
        >
            {submitting ? (
                <ActivityIndicator color="white" size="small" />
            ) : (
                <>
                    <Text className="text-white font-black text-sm tracking-widest uppercase">
                        {currentIndex === questions.length - 1 ? t('finish') : t('next')}
                    </Text>
                    <ChevronRight color="white" size={18} className="ml-2" />
                </>
            )}
        </TouchableOpacity>
      </View>

      {/* ℹ️ Description Modal */}
      <Modal
        visible={showDescription}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
            <View className="bg-[#0F172A] w-full max-h-[80%] rounded-[32px] p-6 border border-white/10 shadow-3xl">
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <Info color="#6366F1" size={24} />
                        <Text className="text-white font-black text-xl ml-3">Tushuntirish</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowDescription(false)} className="bg-white/5 p-2 rounded-full">
                        <X color="white" size={20} />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-slate-300 text-base leading-relaxed font-medium">
                        {question?.description}
                    </Text>
                </ScrollView>
                <TouchableOpacity 
                    onPress={() => setShowDescription(false)}
                    className="mt-8 bg-indigo-600 rounded-2xl py-4 items-center"
                >
                    <Text className="text-white font-black uppercase text-sm tracking-widest">Tushundim</Text>
                </TouchableOpacity>
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
