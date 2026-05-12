import AttemptAnswerTable from '@/components/attempt/AttemptAnswerTable';
import { useTelegramBackButton } from '@/hooks/use-telegram';
import AppLayout from '@/layouts/app-layout';
import { type Attempt, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function AttemptShow() {
    const { attempt } = usePage<{
        attempt: Attempt;
    }>().props;
    const { t } = useTranslation();

    // Telegram BackButton
    useTelegramBackButton(route('attempts.index'));

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${t('attempt')} ( ${attempt.ticket ? attempt.ticket.title : t('real_exam.title')} )`,
            href: route('attempts.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('attempt')} ${attempt.ticket ? attempt.ticket.title : t('real_exam.title')}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search and Per-Page Selection */}
                <div className="flex flex-col justify-between md:flex-row">
                    <div className={'mb-4'}>
                        <Link href={route('attempts.index')} className={'underline'}>
                            {t('attempt')} /
                        </Link>
                        {attempt.ticket ? attempt.ticket.title : t('real_exam.title')}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <AttemptAnswerTable attempt_answers={attempt.attempt_answers ?? []} />
                </div>
            </div>
        </AppLayout>
    );
}
