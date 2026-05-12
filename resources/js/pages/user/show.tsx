import AttemptsChart from '@/components/dashboard/attempt-chart';
import DailyStatsChart from '@/components/dashboard/DailyStatsChart';
import HourlyAttemptsChart from '@/components/dashboard/HourlyAttemptsChart';
import WeeklyAttemptsChart from '@/components/dashboard/WeeklyAttemptsChart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type HourlyStatItem, type StatItem, type User, type WeeklyStatItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LucideChevronRight, LucideUserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UserShow() {
    const { user, daily_attempts, hourly_attempts, today_hourly_attempts, weekly_attempts } = usePage<{
        user: User;
        daily_attempts: StatItem[];
        weekly_attempts: WeeklyStatItem[];
        hourly_attempts: HourlyStatItem[];
        today_hourly_attempts: HourlyStatItem[];
    }>().props;

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('user'),
            href: route('user.index'),
        },
        {
            title: user.name,
            href: route('user.show', user.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('user')} - ${user.name}`} />

            <div className="flex flex-col gap-4 bg-slate-50/50 p-4 md:gap-8 md:p-6 dark:bg-transparent">
                {/* 🌈 User Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                             <Link href={route('user.index')} className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                {t('user')}
                            </Link>
                            <LucideChevronRight className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                            {user.name}
                        </h1>
                        <p className="text-xs text-slate-500 md:text-base dark:text-slate-400">
                            {user.email || user.phone || t('user_profile_statistics')}
                        </p>
                    </div>
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md md:h-16 md:w-16 dark:border-slate-800">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800">
                                <LucideUserCircle className="h-8 w-8 text-slate-400 md:h-10 md:w-10" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 📊 Stats Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* 1. Exam Attempts Card */}
                    <div className="relative overflow-hidden rounded-[24px] bg-[#0F172A] p-5 text-white shadow-2xl md:rounded-[28px]">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-600/20 blur-2xl" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-blue-400 uppercase opacity-90">{t('exam_attempts.title')}</p>
                                <div className="mt-1 flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold tracking-tighter tabular-nums">{user.attempts_count ?? 0}</span>
                                    <span className="text-xs font-semibold text-slate-500">{t('attempts_unit')}</span>
                                </div>
                            </div>

                            {(() => {
                                const totalScore = user.attempts_sum_score ?? 0;
                                const totalQuestions = user.attempts_sum_questions_count ?? 0;
                                const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

                                return (
                                    <div className="mt-6">
                                        <div className="mb-2 flex justify-between text-xs font-semibold">
                                            <span className="text-slate-400">{t('accuracy')}</span>
                                            <span className="text-blue-400">{accuracy}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-800 ring-1 ring-slate-700">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-1000"
                                                style={{ width: `${Math.min(accuracy, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                     {/* Additional Info Card */}
                     <div className="relative overflow-hidden rounded-[24px] bg-white p-5 shadow-sm border border-slate-100 md:rounded-[28px] dark:bg-slate-900 dark:border-slate-800 col-span-1 md:col-span-1 lg:col-span-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t('phone')}</p>
                                <p className="text-sm font-semibold dark:text-white">{user.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t('username')}</p>
                                <p className="text-sm font-semibold dark:text-white">{user.username || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t('telegram_id')}</p>
                                <p className="text-sm font-semibold dark:text-white">{user.telegram_id || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t('created_at')}</p>
                                <p className="text-sm font-semibold dark:text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📈 Charts Section */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <AttemptsChart attempts={user.attempts ?? []} />
                    </div>

                    {(daily_attempts.length > 0) && (
                        <div>
                             <DailyStatsChart dailyUsers={[]} dailyAttempts={daily_attempts} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {weekly_attempts.length > 0 && (
                            <WeeklyAttemptsChart weeklyAttempts={weekly_attempts} title={t('weekly_stats')} />
                        )}
                        {hourly_attempts.length > 0 && (
                            <HourlyAttemptsChart hourlyAttempts={hourly_attempts} title={t('hourly_stats')} />
                        )}
                    </div>

                    {today_hourly_attempts.length > 0 && (
                        <HourlyAttemptsChart
                            hourlyAttempts={today_hourly_attempts}
                            title={t('today_hourly_stats')}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
