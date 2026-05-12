import DeleteItemModal from '@/components/delete-item-modal';
import CreateRoadLineModal from '@/components/road_line/create-road_line-admin-modal';
import UpdateRoadLineModal from '@/components/road_line/update-road_line-modal';
import { RoadLine, RoadLinePaginate } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const AdminRoadLineTable = ({ road_lines }: { road_lines: RoadLinePaginate }) => {
    const { t } = useTranslation();
    const { delete: deleteItem } = useForm();

    const handleDelete = (id: number) => {
        deleteItem(route('road_line.destroy', id), {
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
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('color')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('description')}</th>
                        <th className="border border-gray-300 px-4 py-2 dark:border-gray-600">{t('image_url')}</th>
                        <th className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                            <CreateRoadLineModal />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {road_lines.data.map((item: RoadLine, index: number) => (
                        <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                            <td className="border border-gray-300 px-4 py-2 text-center dark:border-gray-600">
                                {(road_lines.current_page - 1) * road_lines.per_page + index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 font-medium dark:border-gray-600">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-8 rounded border border-black/10" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-mono">{item.color}</span>
                                </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                <span className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                <span className="line-clamp-1 text-xs text-blue-500">{item.image_url}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-600">
                                <div className="flex justify-center gap-2">
                                    <UpdateRoadLineModal road_line={item} />
                                    <DeleteItemModal item={item} onDelete={() => handleDelete(item.id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex flex-col items-center justify-between gap-2 text-sm text-gray-600 sm:flex-row dark:text-gray-300">
                <div>{t('showing', { from: road_lines.from, to: road_lines.to, total: road_lines.total })}</div>
                <div className="flex flex-wrap gap-1">
                    {road_lines.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url ?? '?'}
                            className={`rounded-md px-3 py-1 text-sm transition ${link.active ? 'bg-blue-600 text-white' : !link.url ? 'cursor-not-allowed text-gray-400' : 'border hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminRoadLineTable;
