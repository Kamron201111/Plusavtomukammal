import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import YhqCategoryTable from '@/components/yhq_category/yhq_category-table';
import { Yhq } from '@/types';

export default function YhqAdminShow({ yhq }: { yhq: Yhq }) {
    const { t } = useTranslation();

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('sidebar.yhq'), href: route('yhq.index') },
                { title: yhq.title, href: route('yhq.show', yhq.id) },
            ]}
        >
            <Head title={yhq.title} />
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="mb-4 flex flex-col gap-1">
                    <h1 className="text-2xl font-bold dark:text-white">{yhq.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{t('date')}: {yhq.date ?? '—'}</span>
                        <span>{t('brv_amount')}: {yhq.brv_amount ?? '—'}</span>
                        <span>{t('status')}: {yhq.is_active ? t('active') : t('inactive')}</span>
                    </div>
                </div>
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <YhqCategoryTable categories={yhq.categories || []} yhq_id={yhq.id} />
                </div>
            </div>
        </AppLayout>
    );
}
