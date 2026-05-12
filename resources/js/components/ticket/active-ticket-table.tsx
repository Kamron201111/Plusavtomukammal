import StartAttemptModal from '@/components/ticket/StartAttemptModal';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';
import { Calendar, CheckCircle2, ClipboardList, LayersIcon, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ActiveTicketTable = ({ tickets }: { tickets: Ticket[] }) => {
    const { t } = useTranslation();

    if (!tickets || tickets.length === 0) {
        return (
            <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/20">
                <ClipboardList className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('no_tickets_found')}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('start_by_creating_new_ticket')}</p>
            </div>
        );
    }

    return (
        /* grid-cols-2 mobilda (telefonlar) 2 ta ustun qilib ko'rsatish */
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-1">
            {tickets.map((item, index) => (
                <StartAttemptModal key={item.id} ticket={item}>
                    <div
                        className="group relative flex flex-col overflow-hidden rounded-[20px] bg-white p-3 shadow-sm border-2 border-emerald-500/50 cursor-pointer transition-all hover:shadow-md hover:border-emerald-500 sm:p-4 dark:bg-[#111] dark:border-emerald-500/30 dark:hover:border-emerald-500/70"
                        role="button"
                    >
                        {/* Soft background glow */}
                        <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20 dark:bg-blue-500/15" />

                        {/* Header */}
                        <div className="relative z-10 mb-2 flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center">
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-1.5 text-[18px] font-bold tracking-wider text-blue-500 uppercase dark:text-blue-400">
                                    <LayersIcon className="h-3 w-3" />
                                    {item.title}
                                </div>
                                <div
                                    className={cn(
                                        'flex shrink-0 items-center justify-center rounded-full p-1 backdrop-blur-sm sm:p-1.5',
                                        item.is_active
                                            ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
                                            : 'bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
                                    )}
                                >
                                    {item.is_active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                </div>
                            </div>
                        </div>

                        {/* Description - mobilda ko'p joy olmasligi uchun line-clamp-1 qildik yoki 11px */}
                        {/* <p className="relative z-10 mb-3 line-clamp-2 text-[11px] leading-relaxed text-gray-500 sm:mb-4 sm:text-xs dark:text-gray-400">
                            {item.description}
                        </p> */}

                        <div className="relative z-10 mt-auto flex flex-col gap-2.5 sm:gap-3">
                            {/* Stats Row */}
                            <div className="flex flex-row items-center gap-1.5 sm:gap-3">
                                <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-gray-50/80 px-2 py-1.5 ring-1 ring-gray-100 dark:bg-gray-800/40 dark:ring-gray-800">
                                    <ClipboardList className="h-3 w-3 shrink-0 text-blue-500" />
                                    <div className="flex flex-col">
                                        <span className="mb-0.5 text-[8px] leading-none font-bold text-gray-400 uppercase">{t('question')}</span>
                                        <span className="text-xs leading-none font-bold">{item.questions_count}</span>
                                    </div>
                                </div>
                                <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-gray-50/80 px-2 py-1.5 ring-1 ring-gray-100 dark:bg-gray-800/40 dark:ring-gray-800">
                                    <Calendar className="h-3 w-3 shrink-0 text-orange-500" />
                                    <div className="flex flex-col">
                                        <span className="mb-0.5 text-[8px] leading-none font-bold text-gray-400 uppercase">{t('attempt')}</span>
                                        <span className="text-xs leading-none font-bold">{item.attempts_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </StartAttemptModal>
            ))}
        </div>
    );
};

export default ActiveTicketTable;
