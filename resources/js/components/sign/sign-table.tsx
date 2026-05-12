import DeleteItemModal from '@/components/delete-item-modal';
import CreateSignModal from '@/components/sign/create-sign-modal';
import UpdateSignModal from '@/components/sign/update-sign-modal';
import { Sign } from '@/types';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const SignTable = ({ signs, sign_category_id }: { signs: Sign[]; sign_category_id: number }) => {
    const { t } = useTranslation();
    const { delete: deleteItem } = useForm();

    const handleDelete = (id: number) => {
        deleteItem(route('signs.destroy', id), {
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
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('content')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('image_url')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{t('status')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                            <CreateSignModal sign_category_id={sign_category_id} />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {signs.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-400 dark:border-gray-600">{t('no_signs_found')}</td>
                        </tr>
                    ) : (
                        signs.map((item: Sign, index: number) => (
                            <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">{item.content}</td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    <div className="flex items-center gap-2">
                                        {item.image_url && (
                                            <img src={`/storage/${item.image_url}`} alt={item.content} className="h-10 w-10 rounded object-contain border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                        )}
                                        <span className="line-clamp-1 text-xs text-gray-500">{item.image_url}</span>
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                    {item.is_active ? (
                                        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800 dark:bg-green-500/20 dark:text-green-400">{t('active')}</span>
                                    ) : (
                                        <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-500/20 dark:text-red-400">Inactive</span>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                    <div className="flex justify-center gap-2">
                                        <UpdateSignModal sign={item} />
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

export default SignTable;
