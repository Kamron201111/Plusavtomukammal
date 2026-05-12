import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import UserTable from '@/components/user/user-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type UserPaginate, Role, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function User() {
    const { user, roles } = usePage<{
        user: UserPaginate;
        roles: Role[];
    }>().props;
    const { t } = useTranslation(); // Using the translation hook

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('user'),
            href: '/dashboard',
        },
    ];

    // Form handling for search and per_page
    const { data, setData } = useForm<SearchData>({
        search: '',
        role: '',
        per_page: user.per_page,
        page: user.current_page,
        total: user.total,
        is_bot_blocked: '',
        get_prava: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/user', data); // ✅ Correct for search queries
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('search') || ''; // Get 'search' query from the URL
        const roleQuery = urlParams.get('role') || ''; // Get 'search' query from the URL
        const botQuery = urlParams.get('is_bot_blocked') || '';
        const pravaQuery = urlParams.get('get_prava') || '';
        
        setData({
            ...data,
            search: searchQuery,
            role: roleQuery,
            is_bot_blocked: botQuery,
            get_prava: pravaQuery,
        });
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search and Per-Page Selection */}
                <div className="flex items-center justify-end">
                    <MobileSearchModal roles={roles} data={data} setData={setData} handleSubmit={handleSubmit} />
                    <div className={'hidden lg:block'}>
                        <SearchForm handleSubmit={handleSubmit} roles={roles} setData={setData} data={data} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <UserTable roles={roles} {...user} searchData={data} />
                </div>
            </div>
        </AppLayout>
    );
}
