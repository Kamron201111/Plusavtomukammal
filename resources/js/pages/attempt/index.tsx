import AttemptTable from '@/components/attempt/attempt-table';
import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import AppLayout from '@/layouts/app-layout';
import { type AttemptPaginate, type BreadcrumbItem, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Attempt() {
    const { attempt } = usePage<{
        attempt: AttemptPaginate;
    }>().props;
    const { t } = useTranslation(); // Using the translation hook

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('attempt'),
            href: '/dashboard',
        },
    ];

    // Form handling for search and per_page
    const { data, setData } = useForm<SearchData>({
        search: '',
        per_page: attempt.per_page,
        page: attempt.current_page,
        total: attempt.total,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('attempts.index'), data); // ✅ Correct for search queries
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('search') || ''; // Get 'search' query from the URL
        setData('search', searchQuery); // Set it to the form state
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attempt" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search and Per-Page Selection */}
                <div className="flex items-center justify-end">
                    <MobileSearchModal data={data} setData={setData} handleSubmit={handleSubmit} />
                    <div className={'hidden lg:block'}>
                        <SearchForm handleSubmit={handleSubmit} setData={setData} data={data} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <AttemptTable {...attempt} searchData={data} />
                </div>
            </div>
        </AppLayout>
    );
}
