import DeleteItemModal from '@/components/delete-item-modal';
import { cn } from '@/lib/utils';
import { Auth, SearchData, type AttemptPaginate } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { LucideCheckCircle, LucideClock, LucidePlay } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface AttemptTableProps extends AttemptPaginate {
    searchData: SearchData;
}

const AttemptTable = ({ searchData, ...attempts }: AttemptTableProps) => {
    const { t } = useTranslation();
    const { delete: deleteAttempt } = useForm();
    const { auth } = usePage().props as unknown as { auth?: Auth };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');

    const handleDelete = (id: number) => {
        deleteAttempt(route('attempts.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('deleted_successfully')),
        });
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const prevLink = attempts.links[0];
    const nextLink = attempts.links[attempts.links.length - 1];

    const navigatePage = (url: string | null) => {
        if (!url) return;
        const pageNum = new URL(url, window.location.origin).searchParams.get('page');
        if (pageNum) {
            const payload = Object.fromEntries(
                Object.entries({ ...searchData, page: pageNum }).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
            );
            router.get(window.location.pathname, payload, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Grid: Mobilda 1, Desktopda 2 ustun. Desktopda gap va paddinglar kattalashtirildi */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-6">
                {attempts.data.map((item, index) => {
                    const rowNumber = (attempts.current_page - 1) * attempts.per_page + index + 1;

                    return (
                        <div
                            key={item.id}
                            className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-blue-400 md:p-5 dark:border-slate-800 dark:bg-gray-900"
                        >
                            <div className="flex items-start gap-3 md:gap-4">
                                {/* Row Number: Desktopda kattaroq */}
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[11px] font-bold text-slate-400 md:h-8 md:w-8 md:text-xs dark:bg-slate-800 dark:text-slate-500">
                                    {rowNumber}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <Link href={route('attempts.show', item.id)} className="block space-y-1">
                                        <h3 className="truncate text-sm font-black text-slate-900 transition-colors group-hover:text-blue-600 md:text-base dark:text-white">
                                            {item.ticket ? item.ticket.title : t('real_exam.title')}
                                        </h3>
                                        <p className="truncate text-[11px] font-medium tracking-tight text-slate-500 uppercase md:text-xs">
                                            {item.user?.name}
                                        </p>
                                    </Link>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <span
                                        className={cn(
                                            'rounded-md border px-2 py-0.5 text-[9px] font-black tracking-widest uppercase md:text-[10px]',
                                            !item.finished_at
                                                ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10'
                                                : 'border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800',
                                        )}
                                    >
                                        {!item.finished_at ? t('active') : t('finished')}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 md:text-base dark:text-slate-100">
                                        <LucideCheckCircle className="h-4 w-4 text-emerald-500 md:h-5 md:w-5" />
                                        {item.score}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800/50">
                                <div className="flex flex-col gap-1 font-mono text-[10px] text-slate-400 md:text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <LucidePlay className="h-3 w-3 opacity-60" /> {formatDate(item.started_at)}
                                    </div>
                                    {item.finished_at && (
                                        <div className="flex items-center gap-2">
                                            <LucideClock className="h-3 w-3 opacity-60" /> {formatDate(item.finished_at)}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {!item.finished_at && (
                                        <Link
                                            href={route('practice_show', item.id)}
                                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-95 dark:shadow-none"
                                        >
                                            {t('resume')}
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <div className="md:scale-110">
                                            <DeleteItemModal item={item} onDelete={() => handleDelete(item.id)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination: Desktop va Mobil uchun alohida dark mode fiks bilan */}
            <div className="flex flex-col items-center gap-4 py-8">
                {/* Mobil (‹ Prev / Next ›) */}
                <div className="flex w-full max-w-[340px] items-center justify-between rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden dark:border-gray-700 dark:bg-gray-800">
                    <button
                        disabled={!prevLink.url}
                        onClick={() => navigatePage(prevLink.url)}
                        className={`flex h-10 items-center justify-center rounded-xl border px-5 text-xs font-bold transition-all ${
                            !prevLink.url
                                ? 'pointer-events-none opacity-20 dark:text-gray-600'
                                : 'border-slate-200 bg-white text-slate-700 active:bg-slate-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:active:bg-gray-600'
                        }`}
                    >
                        ‹ {t('previous')}
                    </button>
                    <div className="text-xs font-black tracking-tighter text-slate-500 uppercase dark:text-slate-400">
                        {attempts.current_page} <span className="mx-1 opacity-20">/</span> {attempts.last_page}
                    </div>
                    <button
                        disabled={!nextLink.url}
                        onClick={() => navigatePage(nextLink.url)}
                        className={`flex h-10 items-center justify-center rounded-xl border px-5 text-xs font-bold transition-all ${
                            !nextLink.url
                                ? 'pointer-events-none opacity-20 dark:text-gray-600'
                                : 'border-slate-200 bg-white text-slate-700 active:bg-slate-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:active:bg-gray-600'
                        }`}
                    >
                        {t('next')} ›
                    </button>
                </div>

                {/* Desktop (To'liq sonlar) - O'lchamlar kattalashtirildi */}
                <div className="hidden gap-2 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm lg:flex dark:border-gray-700 dark:bg-gray-800">
                    {attempts.links.map((link, idx) => (
                        <button
                            key={idx}
                            disabled={!link.url}
                            onClick={() => navigatePage(link.url)}
                            className={cn(
                                'flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-sm font-bold transition-all',
                                link.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-gray-700',
                                !link.url && 'pointer-events-none opacity-20',
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label.replace('Previous', '‹').replace('Next', '›') }}
                        />
                    ))}
                </div>

                <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    {attempts.from}-{attempts.to} / {attempts.total}
                </div>
            </div>
        </div>
    );
};

export default AttemptTable;
