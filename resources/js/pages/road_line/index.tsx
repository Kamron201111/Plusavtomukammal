import ActiveRoadLineTable from '@/components/road_line/road_line-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, RoadLine } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Index() {
    // Fixed: The key in the generic type now matches the destructured variable 'road_lines'
    const { road_lines } = usePage<{
        road_lines: RoadLine[];
    }>().props;

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('road_line'),
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('road_line')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-x-auto">
                    {/* We pass road_lines ?? [] to ensure that even if the backend
                        sends null/undefined, the table receives an array.
                    */}
                    <ActiveRoadLineTable road_lines={road_lines ?? []} />
                </div>
            </div>
        </AppLayout>
    );
}
