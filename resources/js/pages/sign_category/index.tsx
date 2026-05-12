import ActiveSignCategoryTable from '@/components/sign_category/sign_category-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SignCategory } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Index() {
    // Fixed: The key in the generic type now matches the destructured variable 'sign_categories'
    const { sign_categories } = usePage<{
        sign_categories: SignCategory[];
    }>().props;

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sign_category'),
            href: '/dashboard',
        },
    ];

    console.log(sign_categories);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('sign_category')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-x-auto">
                    {/* We pass sign_categories ?? [] to ensure that even if the backend
                        sends null/undefined, the table receives an array.
                    */}


                    <ActiveSignCategoryTable categories={sign_categories ?? []} />
                </div>
            </div>
        </AppLayout>
    );
}
