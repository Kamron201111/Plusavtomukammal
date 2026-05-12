import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import AdminRoadLineTable from '@/components/road_line/admin-road_line-table';
import { RoadLinePaginate } from '@/types';

export default function RoadLineAdminIndex({ road_lines }: { road_lines: RoadLinePaginate }) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('sidebar.road_line'), href: route('road_line.index') }]}>
            <Head title={t('road_lines')} />
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-white">{t('road_lines')}</h1>
                </div>
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <AdminRoadLineTable road_lines={road_lines} />
                </div>
            </div>
        </AppLayout>
    );
}
