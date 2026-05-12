import DeleteItemModal from '@/components/delete-item-modal';
import CreateSignCategoryModal from '@/components/sign_category/create-sign_category-modal';
import UpdateSignCategoryModal from '@/components/sign_category/update-sign_category-modal';
import { SignCategory, SignCategoryPaginate } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const AdminSignCategoryTable = ({ sign_categories }: { sign_categories: SignCategoryPaginate }) => {
    const { t } = useTranslation();
    const { delete: deleteItem } = useForm();

    const handleDelete = (id: number) => {
        deleteItem(route('sign_category.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('deleted_successfully')),
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-800 dark:text-gray-100">
                <thead className="bg-gray-100 dark:bg-gray-700/50">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">#</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('name')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{t('status')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{t('signs')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                            <CreateSignCategoryModal />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {sign_categories.data.map((item: SignCategory, index: number) => (
                        <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                            <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                {(sign_categories.current_page - 1) * sign_categories.per_page + index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 font-medium dark:border-gray-600">
                                <Link href={route('sign_category.show', item.id)} className="hover:underline text-blue-600 dark:text-blue-400">
                                    {item.name}
                                </Link>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                {item.is_active ? (
                                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800 dark:bg-green-500/20 dark:text-green-400">{t('active')}</span>
                                ) : (
                                    <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-500/20 dark:text-red-400">{t('inactive') ?? 'Inactive'}</span>
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{item.signs_count ?? 0}</td>
                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                <div className="flex justify-center gap-2">
                                    <UpdateSignCategoryModal sign_category={item} />
                                    <DeleteItemModal item={item} onDelete={() => handleDelete(item.id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex flex-col items-center justify-between gap-2 text-sm text-gray-600 sm:flex-row dark:text-gray-300">
                <div>{t('showing', { from: sign_categories.from, to: sign_categories.to, total: sign_categories.total })}</div>
                <div className="flex flex-wrap gap-1">
                    {sign_categories.links.map((link, idx) => (
                        <Link key={idx} href={link.url ?? '?'} className={`rounded-md px-3 py-1 text-sm transition ${link.active ? 'bg-blue-600 text-white' : !link.url ? 'cursor-not-allowed text-gray-400' : 'border hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSignCategoryTable;
