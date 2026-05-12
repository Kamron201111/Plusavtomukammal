import { YhqCategory } from '@/types';
import { ChevronDown, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ActiveYhqAccordion = ({ categories }: { categories: YhqCategory[] }) => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;
        return categories
            .map((cat) => ({
                ...cat,
                items: cat.items?.filter((item) => 
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                ),
            }))
            .filter((cat) => (cat.items?.length ?? 0) > 0);
    }, [categories, searchQuery]);

    if (!categories || categories.length === 0) {
        return (
            <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/20">
                <FileText className="mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('no_items_found')}</h3>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            {/* Search Panel */}
            <div className="relative mb-2">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder={t('search_fines')}
                    className="w-full rounded-2xl border border-gray-200 py-3 pr-4 pl-12 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredCategories.map((category, idx) => (
                <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.is_active ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' : 'bg-gray-100 text-gray-400'}`}
                            >
                                <FileText className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-gray-900 md:text-2xl dark:text-white">{category.name}</h3>
                                <p className="text-sm font-bold text-gray-500">
                                    {category.items?.length ?? 0} {t('fines_count')}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                    </button>

                    {/* ✅ Avto-balandlik animatsiyasi */}
                    <div
                        className={`grid transition-all duration-500 ease-in-out ${
                            openIndex === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                    >
                        <div className="overflow-hidden">
                            <div className="border-t border-gray-100 bg-gray-50/30 p-4 dark:border-gray-800 dark:bg-transparent">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {category.items?.map((item, iIdx) => (
                                        <div
                                            key={iIdx}
                                            className="group flex flex-col items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-rose-200 dark:border-gray-800 dark:bg-gray-800/40"
                                        >
                                            <div className="flex w-full items-start justify-between">
                                                <h4 className="text-base leading-snug font-black text-gray-900 dark:text-white flex-1">{item.name}</h4>
                                                {(item.penalty_points != null && item.penalty_points > 0) && (
                                                    <span className="ml-2 inline-flex flex-shrink-0 items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-black text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                                                        {item.penalty_points} {t('pts')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="w-full space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                                {item.bhm != null && item.bhm > 0 && (
                                                    <div className="flex justify-between border-b border-gray-50 pb-1 dark:border-gray-700/50">
                                                        <span>{t('bhm')}:</span>
                                                        <span className="font-bold text-gray-900 dark:text-gray-200">{item.bhm}</span>
                                                    </div>
                                                )}
                                                {item.summa != null && (
                                                    <div className="flex justify-between border-b border-gray-50 pb-1 dark:border-gray-700/50">
                                                        <span>{t('summa')}:</span>
                                                        <span className="font-bold text-rose-600 dark:text-rose-400">{item.summa.toLocaleString()} {t('sum')}</span>
                                                    </div>
                                                )}
                                                {item.summa_min != null && item.summa_max != null && (
                                                    <div className="flex justify-between border-b border-gray-50 pb-1 dark:border-gray-700/50">
                                                        <span>{t('summa_min')} - {t('summa_max')}:</span>
                                                        <span className="font-bold text-rose-600 dark:text-rose-400">{item.summa_min.toLocaleString()} - {item.summa_max.toLocaleString()} {t('sum')}</span>
                                                    </div>
                                                )}
                                                {item.discount_summa != null && (
                                                    <div className="flex justify-between border-b border-gray-50 pb-1 dark:border-gray-700/50">
                                                        <span>{t('discount_summa')}:</span>
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.discount_summa.toLocaleString()} {t('sum')}</span>
                                                    </div>
                                                )}
                                                {item.additional_penalty && (
                                                    <div className="flex flex-col gap-1 border-b border-gray-50 pb-1 dark:border-gray-700/50">
                                                        <span className="text-xs">{t('additional_penalty')}:</span>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-300">{item.additional_penalty}</span>
                                                    </div>
                                                )}
                                                {item.description && (
                                                    <p className="mt-2 text-xs italic opacity-80">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveYhqAccordion;
