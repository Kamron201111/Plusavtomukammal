import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

interface AttemptsChartProps {
    attempts: any[];
}

export const AttemptsChart = ({ attempts }: AttemptsChartProps) => {
    const { t } = useTranslation();
    const data = [...attempts].slice(-10);
    const chartHeight = 160;
    const maxScore = 20;
    
    // Grid Lines (Steps of 2)
    const gridLines = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

    if (attempts.length === 0) {
        return (
            <View className="h-44 w-full items-center justify-center bg-slate-50/50 dark:bg-white/5 rounded-[32px] border border-dashed border-slate-200 dark:border-white/10">
                <Text className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest text-center">
                    Ma'lumot mavjud emas
                </Text>
            </View>
        );
    }

    return (
        <View className="w-full">
            {/* 🏷️ Header */}
            <View className="mb-6">
                <Text className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Natijadorlik</Text>
                <Text className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-1 leading-tight">
                    O'quvchilar natijalarini kuzatish va tahlil qilish
                </Text>
            </View>

            <View style={{ height: chartHeight + 60 }} className="w-full relative px-2">
                {/* 🏁 Background Grid Lines */}
                <View className="absolute inset-0 justify-between py-[12px] pl-[10px] pr-2">
                    {gridLines.slice().reverse().map((line) => (
                        <View key={line} className="flex-row items-center h-0.5">
                            <Text className="text-[8px] font-black text-slate-400 dark:text-slate-600 w-5 tabular-nums text-right mr-2">{line}</Text>
                            <View className="flex-1 h-[1px] bg-slate-100 dark:bg-white/5" />
                        </View>
                    ))}
                </View>

                {/* 📊 Responsive Columns Container */}
                <View className="flex-1 flex-row items-end justify-between pl-8 pr-2 pt-3 pb-[12px]">
                    {data.map((item, i) => {
                        const score = Math.min(item.score, maxScore);
                        const barHeight = (score / maxScore) * chartHeight;
                        
                        return (
                            <View key={i} className="items-center flex-1 mx-1">
                                <View style={{ height: chartHeight }} className="w-full justify-end items-center">
                                    <View 
                                        style={{ height: barHeight, width: '85%' }} 
                                        className="bg-indigo-500 dark:bg-indigo-600 rounded-t-xl relative overflow-hidden"
                                    >
                                        <LinearGradient
                                            colors={['rgba(255,255,255,0.2)', 'transparent']}
                                            className="absolute inset-0"
                                        />
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* 📅 Date Labels - Tilted 45deg */}
                <View className="flex-row justify-between pl-8 pr-2 h-14 mt-1">
                    {data.map((item, i) => {
                        const date = new Date(item.date);
                        const UzMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const label = `${UzMonths[date.getMonth()]} ${date.getDate()}`;
                        
                        // Show all or alternate if too many
                        const shouldShow = data.length <= 5 || i % Math.ceil(data.length / 5) === 0 || i === data.length - 1;
                        
                        return (
                            <View key={i} className="flex-1 items-center">
                                {shouldShow && (
                                    <View style={{ transform: [{ rotate: '45deg' }], marginTop: 10 }}>
                                        <Text className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter w-12 text-center">
                                            {label}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};
