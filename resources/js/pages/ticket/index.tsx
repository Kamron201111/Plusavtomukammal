import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import TicketTable from '@/components/ticket/ticket-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type TicketPaginate, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Ticket() {
    const { ticket } = usePage<{
        ticket: TicketPaginate;
    }>().props;
    const { t } = useTranslation(); // Using the translation hook

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('ticket'),
            href: '/dashboard',
        },
    ];

    // Form handling for search and per_page
    const { data, setData } = useForm<SearchData>({
        search: '',
        role: '',
        per_page: ticket.per_page,
        page: ticket.current_page,
        total: ticket.total,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tickets.index'), data); // ✅ Correct for search queries
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('search') || ''; // Get 'search' query from the URL
        setData('search', searchQuery); // Set it to the form state
        const roleQuery = urlParams.get('role') || ''; // Get 'search' query from the URL
        setData('role', roleQuery); // Set it to the form state
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket" />
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
                    <TicketTable {...ticket} searchData={data} />
                </div>
            </div>
        </AppLayout>
    );
}
