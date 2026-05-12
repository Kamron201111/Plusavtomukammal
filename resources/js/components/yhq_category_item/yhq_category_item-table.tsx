import DeleteItemModal from '@/components/delete-item-modal';
import CreateYhqCategoryItemModal from '@/components/yhq_category_item/create-yhq_category_item-modal';
import UpdateYhqCategoryItemModal from '@/components/yhq_category_item/update-yhq_category_item-modal';
import { YhqCategoryItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const YhqCategoryItemTable = ({ items, yhq_category_id }: { items: YhqCategoryItem[]; yhq_category_id: number }) => {
    const { t } = useTranslation();
    const { delete: deleteItem } = useForm();

    const handleDelete = (id: number) => {
        deleteItem(route('yhq_category_item.destroy', id), {
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
                        <th className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">{t('bhm')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">{t('summa')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">{t('discount_summa')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">{t('penalty_points')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('additional_penalty')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{t('status')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                            <CreateYhqCategoryItemModal yhq_category_id={yhq_category_id} />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="border border-gray-300 px-4 py-8 text-center text-gray-400 dark:border-gray-600">{t('no_items_found')}</td>
                        </tr>
                    ) : (
                        items.map((item: YhqCategoryItem, index: number) => (
                            <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    <div className="flex flex-col max-w-[300px]">
                                        <span className="font-semibold text-wrap">{item.name}</span>
                                        {item.description && <span className="text-[11px] text-gray-500 line-clamp-2 mt-1">{item.description}</span>}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">{item.bhm ?? '—'}</td>
                                <td className="border border-gray-300 px-4 py-2 text-right whitespace-nowrap dark:border-gray-600">
                                    {item.summa ? item.summa.toLocaleString() : (item.summa_min && item.summa_max ? `${item.summa_min.toLocaleString()} - ${item.summa_max.toLocaleString()}` : '—')}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-right whitespace-nowrap dark:border-gray-600 text-emerald-600 dark:text-emerald-400">{item.discount_summa?.toLocaleString() ?? '—'}</td>
                                <td className="border border-gray-300 px-4 py-2 text-right dark:border-gray-600">{item.penalty_points ?? '—'}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600 text-xs max-w-[200px] truncate" title={item.additional_penalty ?? undefined}>{item.additional_penalty ?? '—'}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                    {item.is_active ? (
                                        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800 dark:bg-green-500/20 dark:text-green-400">{t('active')}</span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-500/20 dark:text-red-400">Inactive</span>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    <div className="flex justify-center gap-2">
                                        <UpdateYhqCategoryItemModal item={item} />
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

export default YhqCategoryItemTable;
