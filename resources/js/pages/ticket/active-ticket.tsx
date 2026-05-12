import ActiveTicketTable from '@/components/ticket/active-ticket-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Ticket } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ActiveTicket() {
    // Fixed: The key in the generic type now matches the destructured variable 'tickets'
    const { tickets } = usePage<{
        tickets: Ticket[];
    }>().props;

    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('ticket'),
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('ticket')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-x-auto">
                    {/* We pass tickets ?? [] to ensure that even if the backend
                        sends null/undefined, the table receives an array.
                    */}
                    <ActiveTicketTable tickets={tickets ?? []} />
                </div>
            </div>
        </AppLayout>
    );
}
