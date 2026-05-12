import DeleteItemModal from '@/components/delete-item-modal';
import CreateYhqCategoryModal from '@/components/yhq_category/create-yhq_category-modal';
import UpdateYhqCategoryModal from '@/components/yhq_category/update-yhq_category-modal';
import { YhqCategory } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const YhqCategoryTable = ({ categories, yhq_id }: { categories: YhqCategory[]; yhq_id: number }) => {
    const { t } = useTranslation();
    const { delete: deleteItem } = useForm();

    const handleDelete = (id: number) => {
        deleteItem(route('yhq_category.destroy', id), {
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
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{t('items')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                            <CreateYhqCategoryModal yhq_id={yhq_id} />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-400 dark:border-gray-600">{t('no_items_found')}</td>
                        </tr>
                    ) : (
                        categories.map((item: YhqCategory, index: number) => (
                            <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2 font-medium dark:border-gray-600">
                                    <Link href={route('yhq_category.show', item.id)} className="hover:underline text-blue-600 dark:text-blue-400">
                                        {item.name}
                                    </Link>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                    {item.is_active ? (
                                        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800 dark:bg-green-500/20 dark:text-green-400">{t('active')}</span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-500/20 dark:text-red-400">Inactive</span>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{item.items?.length ?? 0}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    <div className="flex justify-center gap-2">
                                        <UpdateYhqCategoryModal category={item} />
                                        <DeleteItemModal item={item} onDelete={() => handleDelete(item.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default YhqCategoryTable;
