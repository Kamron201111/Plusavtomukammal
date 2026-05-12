import ActiveYhqAccordion from '@/components/yhq/active-yhq-accordion';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Yhq } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, Banknote, Calendar, Clock, Percent, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Index() {
    const { yhq } = usePage<{
        yhq: Yhq;
    }>().props;

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('yhq'),
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={yhq?.title ?? t('yhq')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {yhq && (
                    <div className="mb-2 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex flex-col gap-2">
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">
                                {yhq.title}
                            </h1>
                            {yhq.brv_description && (
                                <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                                    {yhq.brv_description}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                            {yhq.brv_amount != null && (
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        <Banknote className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{t('brv_amount')}</p>
                                        <p className="truncate font-bold text-gray-900 dark:text-white">{yhq.brv_amount.toLocaleString()} {t('sum')}</p>
                                    </div>
                                </div>
                            )}
                            {yhq.discount_percent != null && yhq.discount_days != null && (
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                                        <Percent className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{t('discount')} ({yhq.discount_days} {t('days')})</p>
                                        <p className="truncate font-bold text-gray-900 dark:text-white">{yhq.discount_percent}%</p>
                                    </div>
                                </div>
                            )}
                            {yhq.payment_deadline_regular != null && (
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{t('payment_deadline_regular')}</p>
                                        <p className="truncate font-bold text-gray-900 dark:text-white">{yhq.payment_deadline_regular} {t('days')}</p>
                                    </div>
                                </div>
                            )}
                            {yhq.payment_deadline_camera != null && (
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{t('payment_deadline_camera')}</p>
                                        <p className="truncate font-bold text-gray-900 dark:text-white">{yhq.payment_deadline_camera} {t('days')}</p>
                                    </div>
                                </div>
                            )}
                            {yhq.cancellation_if_no_decision_days != null && (
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{t('cancellation_days')}</p>
                                        <p className="truncate font-bold text-gray-900 dark:text-white">{yhq.cancellation_if_no_decision_days} {t('days')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <ActiveYhqAccordion categories={yhq?.categories ?? []} />
                </div>
            </div>
        </AppLayout>
    );
}
