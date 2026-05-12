import { RoadLine } from '@/types';
import { ClipboardList, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ActiveRoadLineTable = ({ road_lines }: { road_lines: RoadLine[] }) => {
    const { t } = useTranslation();

    if (!road_lines || road_lines.length === 0) {
        return (
            <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/20">
                <ClipboardList className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('no_road_lines_found')}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{t('start_by_creating_new_road_line')}</p>
            </div>
        );
    }

    return (
        /* Mobile: 1 ustun, Desktop: 3 ustun */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {road_lines.map((item, index) => (
                <div
                    key={index}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                    {/* Image Section - Kattaroq va aniqroq */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                        {item.image_url ? (
                            <img
                                src={`/storage/${item.image_url}`}
                                alt={item.name}
                                className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.src = '/images/placeholder-sign.png';
                                }}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <Info className="h-10 w-10 opacity-20" />
                            </div>
                        )}

                        <div className="absolute top-4 left-4 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-black text-white backdrop-blur-md">
                            #{String(index + 1).padStart(2, '0')}
                        </div>
                    </div>

                    {/* Body: Content - Matn o'lchamlari kattalashtirildi */}
                    <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-2 line-clamp-1 text-lg font-black tracking-tight text-gray-900 md:text-xl dark:text-white">{item.name}</h3>

                        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>

                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800/50">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-10 rounded border border-black/5 shadow-sm" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">{item.color}</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Bottom Line */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: item.color }} />
                </div>
            ))}
        </div>
    );
};

export default ActiveRoadLineTable;
