import { StatItem } from '@/types';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Raqamlarni qisqartirish funksiyasi
 * 99 dan katta bo'lsa k formatiga o'tkazadi
 */
const formatValue = (val: number): string => {
    if (val > 99) {
        return (val / 1000).toFixed(2).replace(/\.?0+$/, '') + 'k';
    }
    return val.toString();
};

const topLabelsPlugin = {
    id: 'topLabels',
    afterDraw: (chart: any) => {
        const { ctx } = chart;
        const isDarkMode = document.documentElement.classList.contains('dark');

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = 'bold 10px sans-serif'; // Qisqartma uchun shriftni biroz kichraytirdik

        chart.data.datasets.forEach((dataset: any, i: number) => {
            const meta = chart.getDatasetMeta(i);
            if (meta.hidden || !chart.isDatasetVisible(i)) return;

            meta.data.forEach((bar: any, index: number) => {
                const dataValue = dataset.data[index];
                if (dataValue > 0) {
                    // Dark va Light mode uchun ranglar
                    if (isDarkMode) {
                        ctx.fillStyle = '#f8fafc'; // Slate-50
                    } else {
                        // Light mode'da dataset rangiga qarab to'qroq rang
                        ctx.fillStyle = i === 0 ? '#4338ca' : i === 1 ? '#059669' : '#0d9488';
                    }

                    // Formatlangan qiymatni chizish
                    ctx.fillText(formatValue(dataValue), bar.x, bar.y - 4);
                }
            });
        });
        ctx.restore();
    },
};

interface DailyStatsChartProps {
    dailyUsers: StatItem[];
    dailyAttempts: StatItem[];
}

export default function DailyStatsChart({ dailyUsers, dailyAttempts }: DailyStatsChartProps) {
    const { t } = useTranslation();

    const { chartData, allDates } = useMemo(() => {
        const dates = Array.from(new Set([...dailyUsers.map((d) => d.day_date), ...dailyAttempts.map((d) => d.day_date)])).sort();

        const labels = dates.map((dateStr) => new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

        const newUsers = dates.map((date) => dailyUsers.find((d) => d.day_date === date)?.items_count || 0);

        const uniqueAttemptUsers = dates.map((date) => dailyAttempts.find((d) => d.day_date === date)?.unique_users_count || 0);

        const extraAttempts = dates.map((date) => {
            const item = dailyAttempts.find((d) => d.day_date === date);
            const total = item?.items_count || 0;
            const unique = item?.unique_users_count || 0;
            return total - unique;
        });

        return {
            allDates: dates,
            chartData: {
                labels,
                datasets: [
                    {
                        label: t('new_users'),
                        data: newUsers,
                        backgroundColor: 'rgb(99, 102, 241)',
                        stack: 'Stack 0',
                        borderRadius: 6,
                    },
                    {
                        label: t('unique_users_attempt'),
                        data: uniqueAttemptUsers,
                        backgroundColor: 'rgb(16, 185, 129)',
                        stack: 'Stack 1',
                        borderRadius: 0,
                    },
                    {
                        label: t('extra_attempts'),
                        data: extraAttempts,
                        backgroundColor: 'rgba(20, 184, 166, 0.6)',
                        stack: 'Stack 1',
                        borderRadius: 6,
                    },
                ],
            },
        };
    }, [dailyUsers, dailyAttempts, t]);

    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.1)';

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 35 } },
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                align: 'end' as const,
                labels: { usePointStyle: true, boxWidth: 10, color: textColor },
            },
            tooltip: {
                backgroundColor: isDark ? '#0f172a' : '#1e293b',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    footer: (tooltipItems: any) => {
                        const dataIndex = tooltipItems[0].dataIndex;
                        const date = allDates[dataIndex];
                        const total = dailyAttempts.find((d) => d.day_date === date)?.items_count || 0;
                        return tooltipItems[0].datasetIndex >= 1 ? `${t('all_attempts')}: ${total}` : '';
                    },
                },
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: textColor } },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    color: textColor,
                    callback: (value: any) => formatValue(value),
                },
                grid: { color: gridColor },
            },
        },
    };

    return (
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('monthly_stats')}</h3>
            </div>
            <div className="h-[350px] w-full">
                <Bar data={chartData} options={options} plugins={[topLabelsPlugin]} />
            </div>
        </div>
    );
}
