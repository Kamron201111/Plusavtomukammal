import QuestionTable from '@/components/question/QuestionTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Ticket } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function TicketShow() {
    const { ticket } = usePage<{
        ticket: Ticket;
    }>().props;
    const { t } = useTranslation(); // Using the translation hook

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${t('ticket')} ( ${ticket.name} )`,
            href: route('tickets.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ticket ${ticket.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search and Per-Page Selection */}
                <div className="flex flex-col justify-between md:flex-row">
                    <div className={'mb-4'}>
                        <Link href={route('tickets.index')} className={'underline'}>
                            {t('ticket')} /
                        </Link>
                        {ticket?.title}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <QuestionTable questions={ticket.questions} ticket_id={ticket.id} />
                </div>
            </div>
        </AppLayout>
    );
}
