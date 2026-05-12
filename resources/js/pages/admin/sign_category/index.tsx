import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import AdminSignCategoryTable from '@/components/sign_category/admin-sign_category-table';
import { SignCategoryPaginate } from '@/types';

export default function SignCategoryAdminIndex({ sign_categories }: { sign_categories: SignCategoryPaginate }) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={[{ title: t('sidebar.sign_category'), href: route('sign_category.index') }]}>
            <Head title={t('sign_category')} />
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-white">{t('sign_category')}</h1>
                </div>
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <AdminSignCategoryTable sign_categories={sign_categories} />
                </div>
            </div>
        </AppLayout>
    );
}
