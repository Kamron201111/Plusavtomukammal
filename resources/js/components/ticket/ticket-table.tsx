import DeleteItemModal from '@/components/delete-item-modal';
import CreateTicketModal from '@/components/ticket/create-ticket-modal';
import UpdateTicketModal from '@/components/ticket/update-ticket-modal';
import { SearchData, type TicketPaginate } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface TicketTableProps extends TicketPaginate {
    searchData: SearchData;
}

const TicketTable = ({ searchData, ...tickets }: TicketTableProps) => {
    const { t } = useTranslation();
    const { delete: deleteTicket } = useForm();

    const handleDelete = (id: number) => {
        deleteTicket(route('tickets.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('deleted_successfully')),
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-800 dark:text-gray-100">
                <thead className="bg-gray-100 dark:bg-gray-700/50">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">ID</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('title')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{t('status')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{t('count')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('created_at')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                            <CreateTicketModal />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {tickets.data.map((item, index) => (
                        <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                            <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                {(tickets.current_page - 1) * tickets.per_page + index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 font-medium dark:border-gray-600">
                                <Link href={route('tickets.show', item.id)} className="block hover:underline">
                                    <div className="font-semibold">{item.title}</div>
                                    <div className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                                </Link>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                {item.is_active ? (
                                    <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
                                        {t('active')}
                                    </span>
                                ) : (
                                    <span className="inline-flex rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
                                        {t('inactive')}
                                    </span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{item.questions_count}</td>
                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap dark:border-gray-600">
                                {new Date(item.created_at).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                <div className="flex justify-center gap-2">
                                    <UpdateTicketModal ticket={item} />
                                    <DeleteItemModal item={item} onDelete={() => handleDelete(item.id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination - UserTable bilan 100% bir xil */}
            <div className="mt-4 flex flex-col items-center justify-between gap-2 text-sm text-gray-600 sm:flex-row dark:text-gray-300">
                <div>{t('showing', { from: tickets.from, to: tickets.to, total: tickets.total })}</div>
                <div className="flex flex-wrap gap-1">
                    {tickets.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={`${link.url ?? '?'}&search=${searchData.search}&per_page=${searchData.per_page}`}
                            className={`rounded-md px-3 py-1 text-sm transition ${link.active ? 'bg-blue-600 text-white' : !link.url ? 'cursor-not-allowed text-gray-400' : 'border hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicketTable;
