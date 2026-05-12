import { Attempt } from '@/types';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement, // O'zgardi
    PointElement, // O'zgardi
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2'; // O'zgardi
import { useTranslation } from 'react-i18next';

// Elementlarni qayta ro'yxatdan o'tkazamiz
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AttemptsChart({ attempts }: { attempts: Attempt[] }) {
    const { t } = useTranslation();

    const labels = attempts.map((a) =>
        new Date(a.finished_at || a.started_at || a.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
    );

    const highestScore = Math.max(...attempts.map((a) => a.score ?? 0), 20);
    const chartMax = highestScore > 20 ? Math.ceil(highestScore / 5) * 5 + 5 : 20;

    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const primaryColor = 'rgb(99, 102, 241)';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.4)';

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: t('exam_attempts.score'),
                data: attempts.map((a) => a.score ?? 0),
                borderColor: primaryColor,
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.05)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: primaryColor,
                pointHoverRadius: 6,
                borderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#0f172a' : '#1e293b',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: textColor },
            },
            y: {
                min: 0,
                max: chartMax,
                ticks: {
                    stepSize: highestScore > 10 ? undefined : 1,
                    color: textColor,
                },
                grid: { color: gridColor },
            },
        },
    };

    return (
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('exam_attempts.performance')}</h3>
                <p className="text-sm text-slate-500">{t('exam_attempts.track_and_review_student_performance')}</p>
            </div>

            <div className="h-[240px] w-full">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
