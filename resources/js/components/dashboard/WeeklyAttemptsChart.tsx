import { WeeklyStatItem } from '@/types';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WeeklyAttemptsChartProps {
    weeklyAttempts: WeeklyStatItem[];
    title: string;
}

export default function WeeklyAttemptsChart({ weeklyAttempts, title }: WeeklyAttemptsChartProps) {
    const { t } = useTranslation();

    const chartData = useMemo(() => {
        // SQL dagi WEEKDAY() 0=Dushanba, ..., 6=Yakshanba qaytaradi
        const weekdayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        const labels = weekdayKeys.map((key) => t(`weekday.${key}`));

        const uniqueUsers = weekdayKeys.map((_, index) => {
            const found = weeklyAttempts.find((item) => Number(item.weekday_number) === index);
            return found ? found.unique_users_count : 0;
        });

        const extraAttempts = weekdayKeys.map((_, index) => {
            const found = weeklyAttempts.find((item) => Number(item.weekday_number) === index);
            return found ? found.items_count - found.unique_users_count : 0;
        });

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
    }, [weeklyAttempts, t]);

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
                        const index = tooltipItems[0].dataIndex;
                        const found = weeklyAttempts.find((item) => Number(item.weekday_number) === index);
                        return found ? `${t('all_attempts')}: ${found.items_count}` : '';
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' },
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
