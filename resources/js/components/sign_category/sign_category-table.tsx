import { SignCategory } from '@/types';
import { CheckCircle2, ChevronDown, LayoutGrid, Maximize2, Search, X, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SignCategoryAccordion = ({ categories }: { categories: SignCategory[] }) => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedImage]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;
        return categories
            .map((cat) => ({
                ...cat,
                signs: cat.signs?.filter((sign) => sign.content.toLowerCase().includes(searchQuery.toLowerCase())),
            }))
            .filter((cat) => (cat.signs?.length ?? 0) > 0);
    }, [categories, searchQuery]);

    if (!categories || categories.length === 0) {
        return (
            <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/20">
                <LayoutGrid className="mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('no_categories_found')}</h3>
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
                    placeholder={t('search_signs')}
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
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.is_active ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10' : 'bg-gray-100 text-gray-400'}`}
                            >
                                <LayoutGrid className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight text-gray-900 md:text-2xl dark:text-white">{category.name}</h3>
                                <p className="text-sm font-bold text-gray-500">
                                    {category.signs?.length ?? 0} {t('signs_count')}
                                </p>
                            </div>
                        </div>
                        <ChevronDown className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                    </button>

                    {/* ✅ ENG MUHIM QISM: Grid orqali avto-balandlik animatsiyasi */}
                    <div
                        className={`grid transition-all duration-500 ease-in-out ${
                            openIndex === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                    >
                        <div className="overflow-hidden">
                            <div className="border-t border-gray-100 bg-gray-50/30 p-4 dark:border-gray-800 dark:bg-transparent">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {category.signs?.map((sign, sIdx) => (
                                        <div
                                            key={sIdx}
                                            className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 dark:border-gray-800 dark:bg-gray-800/40"
                                        >
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 p-2 dark:bg-gray-900">
                                                <img
                                                    src={`/storage/${sign.image_url}`}
                                                    alt={sign.content}
                                                    className="h-full w-full cursor-zoom-in object-contain transition-transform duration-300 group-hover:scale-110"
                                                    onClick={() => setSelectedImage(`/storage/${sign.image_url}`)}
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/images/placeholder-sign.png';
                                                    }}
                                                />
                                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Maximize2 className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                                <h4 className="text-base leading-snug font-black text-gray-900 dark:text-white">{sign.content}</h4>
                                                <div className="mt-3 flex items-center gap-2">
                                                    {sign.is_active ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase dark:bg-emerald-500/10">
                                                            <CheckCircle2 className="h-3 w-3" /> {t('active')}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500 uppercase dark:bg-red-500/10">
                                                            <XCircle className="h-3 w-3" /> {t('inactive')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <div
                        className="animate-in zoom-in relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white p-2 duration-300 dark:bg-gray-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={selectedImage} alt="Full Screen" className="h-full max-h-[80vh] w-full rounded-lg object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignCategoryAccordion;
