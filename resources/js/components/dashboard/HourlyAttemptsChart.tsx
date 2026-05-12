import { HourlyStatItem } from '@/types';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Oldingi raqamlarni qisqartirish va plugin kodi (topLabelsPlugin) xuddi shu yerda qoladi

interface HourlyAttemptsChartProps {
    hourlyAttempts: HourlyStatItem[];
    title: string;
}

export default function HourlyAttemptsChart({ hourlyAttempts, title }: HourlyAttemptsChartProps) {
    const { t } = useTranslation();

    const chartData = useMemo(() => {
        // 0 dan 23 gacha bo'lgan barcha soatlarni generatsiya qilamiz
        const hours = Array.from({ length: 24 }, (_, i) => i);

        const uniqueUsers = hours.map((h) => {
            const found = hourlyAttempts.find((item) => item.hour_of_day === h);
            return found ? found.unique_users_count : 0;
        });

        const extraAttempts = hours.map((h) => {
            const found = hourlyAttempts.find((item) => item.hour_of_day === h);
            return found ? found.items_count - found.unique_users_count : 0;
        });

        const labels = hours.map((h) => `${h}:00`);

        return {
            labels,
            datasets: [
                {
                    label: t('unique_users_attempt'),
                    data: uniqueUsers,
                    backgroundColor: 'rgb(16, 185, 129)',
                    stack: 'Stack 0',
                    borderRadius: 0,
                },
                {
                    label: t('extra_attempts'),
                    data: extraAttempts,
                    backgroundColor: 'rgba(20, 184, 166, 0.6)',
                    stack: 'Stack 0',
                    borderRadius: 6,
                },
            ],
        };
    }, [hourlyAttempts, t]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 30 } },
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                align: 'end' as const,
                labels: { usePointStyle: true, boxWidth: 10, color: '#94a3b8' },
            },
            tooltip: {
                backgroundColor: '#1e293b',
                callbacks: {
                    footer: (tooltipItems: any) => {
                        const h = tooltipItems[0].dataIndex;
                        const found = hourlyAttempts.find((item) => item.hour_of_day === h);
                        return found ? `${t('all_attempts')}: ${found.items_count}` : '';
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: { precision: 0, color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
            },
        },
    };

    return (
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
            </div>
            <div className="h-[350px] w-full">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
