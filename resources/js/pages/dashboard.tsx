import AttemptsChart from '@/components/dashboard/attempt-chart';
import DailyStatsChart from '@/components/dashboard/DailyStatsChart';
import HourlyAttemptsChart from '@/components/dashboard/HourlyAttemptsChart';
import WeeklyAttemptsChart from '@/components/dashboard/WeeklyAttemptsChart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, HourlyStatItem, StatItem, User, WeeklyStatItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, LucideChevronRight, LucideClipboardList, LucideShapes, LucideSplit, LucideUserCircle, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { user, daily_users, daily_attempts, hourly_attempts, today_hourly_attempts, weekly_attempts } = usePage<{
        user: User;
        daily_users: StatItem[];
        daily_attempts: StatItem[];
        weekly_attempts: WeeklyStatItem[];
        hourly_attempts: HourlyStatItem[];
        today_hourly_attempts: HourlyStatItem[];
    }>().props;
    const { t } = useTranslation();
    const [showExamModal, setShowExamModal] = useState(false);
    const [selectedCount, setSelectedCount] = useState<20 | 50>(20);
    const [isStarting, setIsStarting] = useState(false);

    const handleStartExam = () => {
        if (isStarting) return;
        setIsStarting(true);
        router.post(route('attempts.store'), { ticket_id: null, questions_count: selectedCount }, {
            onFinish: () => setIsStarting(false),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('sidebar.dashboard')} />

            <div className="flex flex-col gap-4 bg-muted/30 p-4 md:gap-8 md:p-6 dark:bg-transparent">
                {/* 🌈 Welcome Header - Ixchamroq */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                            {user.name.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-xs text-slate-500 md:text-base dark:text-slate-400">{t('check_your_progress_and_scores')}</p>
                    </div>
                    {/* Profil rasmi headerga ko'chirildi */}
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm md:hidden dark:border-slate-800">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800">
                                <LucideUserCircle className="h-6 w-6 text-slate-400" />
                            </div>
                        )}
                    </div>
                </div>
                {/* 📊 Stats Grid */}
                <div className="grid grid-cols-6 gap-3 md:grid-cols-6 md:gap-6">
                    {/* 1. Stats Card - Deep Luxury Blue */}
                    <div className="relative col-span-4 overflow-hidden rounded-[24px] bg-[#0F172A] p-4 text-white shadow-2xl md:col-span-1 md:rounded-[28px] md:p-5 dark:border dark:border-white/5">
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-600/20 blur-2xl dark:bg-blue-400/10" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase opacity-90">{t('exam_attempts.title')}</p>
                                <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
                                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter tabular-nums">{user.attempts_count ?? 0}</span>
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500">{t('attempts_unit')}</span>
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

                    {/* 1.5. Real Exam Card - Elegant Indigo */}
                    <div className="relative col-span-2 flex flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-indigo-600 to-violet-800 p-3 text-white shadow-xl shadow-indigo-500/20 transition-all md:col-span-1 md:rounded-[28px] md:p-4 dark:border dark:border-white/10">
                        <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10 blur-xl dark:bg-indigo-300/10" />
                        <div>
                            <p className="text-[11px] sm:text-xs font-black tracking-wider text-white/70 uppercase">{t('real_exam.title')}</p>
                            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs leading-tight font-semibold text-white">{t('real_exam.description')}</p>
                        </div>
                        <button
                            onClick={() => setShowExamModal(true)}
                            className="mt-2 sm:mt-3 flex w-full items-center justify-center rounded-lg sm:rounded-xl bg-white/20 py-2 sm:py-2.5 text-xs sm:text-sm font-black tracking-wide backdrop-blur-md transition-all hover:bg-white/30 active:scale-95"
                        >
                            {t('real_exam.start')}
                        </button>
                    </div>

                    {/* 2. Tickets Card - Vibrant Amber (Urgent Action) */}
                    <Link
                        href={route('active_tickets')}
                        className="col-span-3 md:col-span-1 group relative flex min-h-[70px] md:min-h-[170px] flex-row md:flex-col items-center md:items-start justify-start md:justify-between overflow-hidden rounded-[20px] md:rounded-[28px] bg-gradient-to-br from-orange-400 to-amber-600 p-3 md:p-4 text-white shadow-xl shadow-orange-500/20 transition-all active:scale-95 md:hover:-translate-y-2"
                    >
                        <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/20 blur-xl" />
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-md md:h-12 md:w-12 md:rounded-2xl">
                            <LucideClipboardList className="h-4 w-4 md:h-6 md:w-6" />
                        </div>
                        <div className="relative z-10 ml-3 mt-0 md:ml-0 md:mt-auto">
                            <div className="text-xs leading-tight font-bold tracking-tight md:text-xl">{t('sidebar.ticket')}</div>
                            <div className="hidden mt-1.5 md:flex items-center text-[11px] font-semibold tracking-wide uppercase opacity-80">
                                {t('view_all')} <LucideChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* 3. Road Signs Card - Elegant Emerald */}
                    <Link
                        href={route('active_sign_category')}
                        className="col-span-3 md:col-span-1 group relative flex min-h-[70px] md:min-h-[170px] flex-row md:flex-col items-center md:items-start justify-start md:justify-between overflow-hidden rounded-[20px] md:rounded-[28px] bg-gradient-to-br from-emerald-500 to-teal-700 p-3 md:p-4 text-white shadow-xl shadow-emerald-500/20 transition-all active:scale-95 md:hover:-translate-y-2"
                    >
                        <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10 blur-xl" />
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-md md:h-12 md:w-12 md:rounded-2xl">
                            <LucideShapes className="h-4 w-4 md:h-6 md:w-6" />
                        </div>
                        <div className="relative z-10 ml-3 mt-0 md:ml-0 md:mt-auto">
                            <div className="text-xs leading-tight font-bold tracking-tight md:text-xl">{t('road_signs')}</div>
                            <div className="hidden mt-1.5 md:flex items-center text-[11px] font-semibold tracking-wide uppercase opacity-80">
                                {t('view_all')} <LucideChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* 4. Road Lines Card - Cool Violet */}
                    <Link
                        href={route('active_road_line')}
                        className="col-span-3 md:col-span-1 group relative flex min-h-[70px] md:min-h-[170px] flex-row md:flex-col items-center md:items-start justify-start md:justify-between overflow-hidden rounded-[20px] md:rounded-[28px] bg-gradient-to-br from-violet-500 to-purple-700 p-3 md:p-4 text-white shadow-xl shadow-purple-500/20 transition-all active:scale-95 md:hover:-translate-y-2"
                    >
                        <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10 blur-xl" />
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-md md:h-12 md:w-12 md:rounded-2xl">
                            <LucideSplit className="h-4 w-4 md:h-6 md:w-6" />
                        </div>
                        <div className="relative z-10 ml-3 mt-0 md:ml-0 md:mt-auto">
                            <div className="text-xs leading-tight font-bold tracking-tight md:text-xl">{t('road_lines')}</div>
                            <div className="hidden mt-1.5 md:flex items-center text-[11px] font-semibold tracking-wide uppercase opacity-80">
                                {t('view_all')} <LucideChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* 5. Jarimalar / YHQ Card - Rose / Red */}
                    <Link
                        href={route('active_yhq')}
                        className="col-span-3 md:col-span-1 group relative flex min-h-[70px] md:min-h-[170px] flex-row md:flex-col items-center md:items-start justify-start md:justify-between overflow-hidden rounded-[20px] md:rounded-[28px] bg-gradient-to-br from-rose-500 to-red-700 p-3 md:p-4 text-white shadow-xl shadow-red-500/20 transition-all active:scale-95 md:hover:-translate-y-2 dark:border dark:border-white/10"
                    >
                        <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10 blur-xl dark:bg-rose-300/10" />
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-md md:h-12 md:w-12 md:rounded-2xl">
                            <FileText className="h-4 w-4 md:h-6 md:w-6" />
                        </div>
                        <div className="relative z-10 ml-3 mt-0 md:ml-0 md:mt-auto">
                            <div className="text-xs leading-tight font-bold tracking-tight md:text-xl">{t('fines', 'Jarimalar')}</div>
                            <div className="hidden mt-1.5 md:flex items-center text-[11px] font-semibold tracking-wide uppercase opacity-80">
                                {t('view_all')} <LucideChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </div>{' '}
                {/* 📈 Chart Section */}
                <div className={''}>
                    <AttemptsChart attempts={user.attempts ?? []} />
                </div>
                {(daily_users.length > 0 || daily_attempts.length > 0) && (
                    <div className={''}>
                        <DailyStatsChart dailyUsers={daily_users} dailyAttempts={daily_attempts} />
                    </div>
                )}
                {today_hourly_attempts.length > 0 && (
                    <>
                        <div className={''}>
                            <HourlyAttemptsChart
                                hourlyAttempts={today_hourly_attempts}
                                title={t('today_hourly_stats', 'Bugungi soatbay statistika')}
                            />
                        </div>
                    </>
                )}
                {weekly_attempts.length > 0 && (
                    <>
                        <div className={''}>
                            <WeeklyAttemptsChart weeklyAttempts={weekly_attempts} title={t('weekly_stats', 'Haftalik statistika')} />
                        </div>
                    </>
                )}
                {hourly_attempts.length > 0 && (
                    <>
                        <div className={''}>
                            <HourlyAttemptsChart hourlyAttempts={hourly_attempts} title={t('hourly_stats', 'Soatbay statistika')} />
                        </div>
                    </>
                )}
            </div>

            {/* Real Exam Modal */}
            {showExamModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-800 p-6 text-white">
                            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                            <button
                                onClick={() => setShowExamModal(false)}
                                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 active:scale-90"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="relative z-10">
                                <div className="mb-1 flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-300" />
                                    <span className="text-xs font-black tracking-widest text-indigo-200 uppercase">{t('real_exam.title')}</span>
                                </div>
                                <h2 className="text-xl font-extrabold tracking-tight">{t('real_exam.modal_title', 'Savolar sonini tanlang')}</h2>
                                <p className="mt-1 text-sm text-indigo-200">{t('real_exam.modal_description', 'Imtihon uchun nechta savol bo\'lishini tanlang')}</p>
                            </div>
                        </div>

                        {/* Count Selection */}
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {([20, 50] as const).map((count) => (
                                    <button
                                        key={count}
                                        onClick={() => setSelectedCount(count)}
                                        className={`relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 transition-all active:scale-95 ${
                                            selectedCount === count
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md shadow-indigo-500/20'
                                                : 'border-border bg-muted/40 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                                        }`}
                                    >
                                        {selectedCount === count && (
                                            <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                        )}
                                        <span className={`text-3xl font-extrabold tabular-nums ${selectedCount === count ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'}`}>
                                            {count}
                                        </span>
                                        <span className={`text-xs font-semibold ${selectedCount === count ? 'text-indigo-500' : 'text-muted-foreground'}`}>
                                            {t('real_exam.questions', 'ta savol')}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => setShowExamModal(false)}
                                    className="flex-1 rounded-xl border border-border bg-muted py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted/80 active:scale-[0.98]"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    onClick={handleStartExam}
                                    disabled={isStarting}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-600 active:scale-[0.98] disabled:opacity-60"
                                >
                                    {isStarting ? t('starting') : t('real_exam.start')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
