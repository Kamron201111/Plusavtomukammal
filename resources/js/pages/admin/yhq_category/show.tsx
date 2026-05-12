import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import YhqCategoryItemTable from '@/components/yhq_category_item/yhq_category_item-table';
import { YhqCategory } from '@/types';

export default function YhqCategoryAdminShow({ yhq_category }: { yhq_category: YhqCategory }) {
    const { t } = useTranslation();

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('sidebar.yhq'), href: route('yhq.index') },
                { title: yhq_category.yhq?.title ?? t('yhq'), href: route('yhq.show', yhq_category.yhq_id) },
                { title: yhq_category.name, href: route('yhq_category.show', yhq_category.id) },
            ]}
        >
            <Head title={yhq_category.name} />
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="mb-4 flex flex-col gap-1">
                    <h1 className="text-2xl font-bold dark:text-white">{yhq_category.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('status')}: {yhq_category.is_active ? t('active') : t('inactive')}
                    </p>
                </div>
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <YhqCategoryItemTable items={yhq_category.items || []} yhq_category_id={yhq_category.id} />
                </div>
            </div>
        </AppLayout>
    );
}
