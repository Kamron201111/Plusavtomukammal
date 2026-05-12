import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import AdminYhqTable from '@/components/yhq/yhq-table';
import { YhqPaginate } from '@/types';

export default function YhqAdminIndex({ yhqs }: { yhqs: YhqPaginate }) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('sidebar.yhq'), href: route('yhq.index') }]}>
            <Head title={t('yhq')} />
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-white">{t('yhq')}</h1>
                </div>
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <AdminYhqTable yhqs={yhqs} />
                </div>
            </div>
        </AppLayout>
    );
}
