import DeleteItemModal from '@/components/delete-item-modal';
import CreateUserModal from '@/components/user/create-user-modal';
import UpdateUserModal from '@/components/user/update-user-modal';
import { Auth, Role, SearchData, type UserPaginate } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { LucideUserCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface UserTableProps extends UserPaginate {
    roles: Role[];
    searchData: SearchData;
}

const UserTable = ({ roles, searchData, ...user }: UserTableProps) => {
    const { t } = useTranslation();
    const { auth } = usePage().props as unknown as { auth?: Auth };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');

    const { delete: deleteUser, reset, errors: deleteError, clearErrors } = useForm();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('sv-SE').replace('T', ' '); // Y-m-d H:i:s
    };

    const handleDelete = (id: number) => {
        deleteUser(`/user/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                toast.success(t('deleted_successfully'));
            },
            onError: (err) => {
                const errorMessage = err?.error || t('delete_failed');
                toast.error(errorMessage);
            },
        });
    };

    const prevLink = user.links[0];
    const nextLink = user.links[user.links.length - 1];

    const buildPageUrl = (url: string | null) => {
        if (!url) return null;
        const pageNum = new URL(url, window.location.origin).searchParams.get('page');
        return pageNum ? { ...searchData, page: pageNum } : null;
    };

    const navigatePage = (url: string | null) => {
        const params = buildPageUrl(url);
        if (params) {
            const payload = Object.fromEntries(
                Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
            );
            router.get('/user', payload, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* --- Desktop Table View --- */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block dark:border-gray-800 dark:bg-gray-800">
                <table className="w-full table-fixed border-collapse text-left text-sm dark:text-gray-100">
                    <thead className="bg-gray-50/50 text-xs font-bold tracking-wider text-gray-500 uppercase dark:bg-gray-700/50 dark:text-gray-400">
                        <tr>
                            <th className="w-[50px] px-4 py-4">{t('n')}</th>
                            <th className="w-[60px] px-4 py-4">{t('avatar', 'Rasm')}</th>
                            <th className="w-[18%] px-4 py-4">{t('name')}</th>
                            <th className="w-[12%] px-4 py-4">{t('username')}</th>
                            <th className="w-[15%] px-4 py-4">{t('telegram_id')}</th>
                            <th className="w-[15%] px-4 py-4">{t('phone')}</th>
                            <th className="w-[20%] px-4 py-4">{t('email')}</th>
                            <th className="w-[160px] px-4 py-4">{t('created_at')}</th>
                            <th className="w-[100px] px-4 py-4 pr-6 text-right">
                                <CreateUserModal />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {user.data.map((item, index) => (
                            <tr key={item.id} className="font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                <td className="px-4 py-4 text-xs text-gray-400">{(user.current_page - 1) * user.per_page + index + 1}</td>
                                <td className="px-4 py-4">
                                    <div 
                                        className="h-10 w-10 shrink-0 cursor-zoom-in overflow-hidden rounded-full border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                                        onClick={() => item.avatar && setSelectedImage(item.avatar)}
                                    >
                                        {item.avatar ? (
                                            <img src={item.avatar} alt={item.name} className="h-full w-full object-cover transition-transform hover:scale-110" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                <LucideUserCircle className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <Link
                                        href={`/user/${item.id}`}
                                        className="block truncate font-bold text-blue-600 hover:underline dark:text-blue-400"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {item.roles?.map((role) => (
                                            <span
                                                key={role.id}
                                                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase dark:bg-slate-700 dark:text-slate-400"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                        {item.get_prava && (
                                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase dark:bg-emerald-900/40 dark:text-emerald-400">
                                                Prava olgan
                                            </span>
                                        )}
                                        {item.is_bot_blocked && (
                                            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 uppercase dark:bg-rose-900/40 dark:text-rose-400">
                                                Bot block
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="truncate px-4 py-4 text-slate-500 italic dark:text-slate-400">@{item.username}</td>
                                <td className="truncate px-4 py-4 font-mono text-xs">{item.telegram_id}</td>
                                <td className="truncate px-4 py-4">{item.phone}</td>
                                <td className="truncate px-4 py-4 italic opacity-70">{item.email}</td>
                                <td className="px-4 py-4 font-mono text-xs opacity-60">{formatDate(item.created_at)}</td>
                                <td className="px-4 py-4 pr-6 text-right">
                                    <div className="flex justify-end gap-1.5">
                                        <UpdateUserModal roles={roles} user={item} />
                                        {isAdmin && <DeleteItemModal item={item} onDelete={handleDelete} />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Mobile Compact Card View --- */}
            <div className="space-y-2.5 lg:hidden">
                <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                        {t('users')} • {user.total}
                    </span>
                    <CreateUserModal />
                </div>
                {user.data.map((item, index) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all active:scale-[0.99] dark:border-gray-700 dark:bg-gray-900"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div 
                                    className="flex h-10 w-10 shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-blue-50 text-sm font-black text-blue-600 dark:border-slate-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    onClick={() => item.avatar && setSelectedImage(item.avatar)}
                                >
                                    {item.avatar ? (
                                        <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                                    ) : (
                                        item.name.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <Link
                                        href={`/user/${item.id}`}
                                        className="mb-0.5 block truncate text-sm leading-tight font-black text-slate-900 dark:text-white"
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                        <span className="text-blue-500 italic">@{item.username}</span>
                                        <span>•</span>
                                        <span className="truncate">{item.telegram_id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex shrink-0 gap-1.5 rounded-xl bg-slate-50/50 p-1 dark:bg-gray-800">
                                <UpdateUserModal roles={roles} user={item} />
                                {isAdmin && <DeleteItemModal item={item} onDelete={handleDelete} />}
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2 border-t border-slate-50 pt-3 dark:border-gray-800/50">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                <div className="flex gap-4">
                                    <span className="font-semibold">
                                        <span className="mr-1 text-[9px] font-black uppercase opacity-40">{t('phone')}:</span> {item.phone || '-'}
                                    </span>
                                    <span className="max-w-[130px] truncate font-semibold">
                                        <span className="mr-1 text-[9px] font-black uppercase opacity-40">{t('email')}:</span> {item.email || '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-0.5 flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                    {item.roles?.map((role) => (
                                        <span
                                            key={role.id}
                                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-black tracking-tighter text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400"
                                        >
                                            {role.name}
                                        </span>
                                    ))}
                                    {item.get_prava && (
                                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black tracking-tighter text-emerald-600 uppercase dark:bg-emerald-900/40 dark:text-emerald-400">
                                            Prava
                                        </span>
                                    )}
                                    {item.is_bot_blocked && (
                                        <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[9px] font-black tracking-tighter text-rose-600 uppercase dark:bg-rose-900/40 dark:text-rose-400">
                                            Block
                                        </span>
                                    )}
                                </div>
                                <span className="font-mono text-[10px] font-bold text-slate-400">{formatDate(item.created_at)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Smart Responsive Pagination --- */}
            <div className="flex flex-col items-center gap-4 py-8">
                {/* Mobile View: Prev / Next buttons */}
                <div className="flex w-full max-w-[320px] items-center justify-between rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden dark:border-gray-700 dark:bg-gray-800">
                    <button
                        disabled={!prevLink.url}
                        onClick={() => navigatePage(prevLink.url)}
                        className={`flex h-10 items-center justify-center rounded-xl border px-5 text-xs font-black transition-all ${
                            !prevLink.url
                                ? 'pointer-events-none border-transparent bg-slate-50 opacity-20 dark:bg-gray-900'
                                : 'border-slate-200 bg-white text-slate-700 active:bg-slate-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
                        }`}
                    >
                        ‹ {t('previous')}
                    </button>

                    <div className="text-[11px] font-black tracking-tighter text-slate-500 uppercase dark:text-slate-400">
                        {user.current_page} <span className="mx-1 opacity-20">/</span> {user.last_page}
                    </div>

                    <button
                        disabled={!nextLink.url}
                        onClick={() => navigatePage(nextLink.url)}
                        className={`flex h-10 items-center justify-center rounded-xl border px-5 text-xs font-black transition-all ${
                            !nextLink.url
                                ? 'pointer-events-none border-transparent bg-slate-50 opacity-20 dark:bg-gray-900'
                                : 'border-slate-200 bg-white text-slate-700 active:bg-slate-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
                        }`}
                    >
                        {t('next')} ›
                    </button>
                </div>

                {/* Desktop View: Numbered links */}
                <div className="hidden gap-1.5 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm lg:flex dark:border-gray-700 dark:bg-gray-800">
                    {user.links.map((link, idx) => (
                        <button
                            key={idx}
                            disabled={!link.url}
                            onClick={() => navigatePage(link.url)}
                            className={`flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-sm font-black transition-all ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-gray-700'
                            } ${!link.url ? 'pointer-events-none opacity-20' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label.replace('Previous', '‹').replace('Next', '›') }}
                        />
                    ))}
                </div>

                <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    {user.from}-{user.to} / {user.total}
                </div>
            </div>

            {/* --- Lightbox Overlay --- */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <img 
                            src={selectedImage} 
                            alt="Enlarged" 
                            className="h-auto w-full max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
