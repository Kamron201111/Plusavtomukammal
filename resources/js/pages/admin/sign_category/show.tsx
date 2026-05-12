import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import SignTable from '@/components/sign/sign-table';
import { SignCategory } from '@/types';

export default function SignCategoryAdminShow({ sign_category }: { sign_category: SignCategory }) {
    const { t } = useTranslation();

    return (
        <AppLayout
            breadcrumbs={[
                { title: t('sidebar.sign_category'), href: route('sign_category.index') },
                { title: sign_category.name, href: route('sign_category.show', sign_category.id) },
            ]}
        >
            <Head title={sign_category.name} />
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="mb-4 flex flex-col gap-1">
                    <h1 className="text-2xl font-bold dark:text-white">{sign_category.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('status')}: {sign_category.is_active ? t('active') : t('inactive')}
                    </p>
                </div>
                <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <SignTable signs={sign_category.signs || []} sign_category_id={sign_category.id} />
                </div>
            </div>
        </AppLayout>
    );
}
