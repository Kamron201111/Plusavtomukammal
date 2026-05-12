import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AttemptAnswer } from '@/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LucideCheckCircle2, LucideHelpCircle, LucideImage, LucideInfo, LucideXCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AttemptAnswerTableProps {
    attempt_answers: AttemptAnswer[];
}

const AttemptAnswerTable = ({ attempt_answers }: AttemptAnswerTableProps) => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const getImageUrl = (path: string | null) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    return (
        <div className="space-y-4">
            {/* --- Desktop Table View (lg+) --- */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-200 lg:block dark:border-gray-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="w-12 p-4 font-bold text-gray-400">#</th>
                            <th className="w-24 p-4 font-bold">{t('image')}</th>
                            <th className="p-4 font-bold">{t('attempt_answer_and_answers')}</th>
                            <th className="w-64 p-4 font-bold">{t('selected_answer')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-slate-900/20">
                        {attempt_answers.map((item, index) => (
                            <tr key={item.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                <td className="p-4 text-center font-mono text-gray-400">{index + 1}</td>
                                <td className="p-4">
                                    <QuestionImage url={getImageUrl(item.question?.image_url ?? null)} onOpen={setSelectedImage} t={t} />
                                </td>
                                <td className="p-4">
                                    <div className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{item.question?.content}</div>

                                    {item.question?.description && (
                                        <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/40 p-3 text-[11px] text-gray-600 dark:border-blue-900/20 dark:bg-blue-900/10 dark:text-gray-400">
                                            <LucideInfo className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                                            <span className="leading-relaxed italic">{item.question.description}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-1.5">
                                        {item.question?.answers?.map((ans) => (
                                            <AnswerItem key={ans.id} content={ans.content} isCorrect={ans.is_correct} />
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 align-top">
                                    {/* Desktop Selected Answer - Card ko'rinishida */}
                                    <div className="rounded-lg bg-gray-50/50 p-2 dark:bg-gray-800/40">
                                        {item.answer ? (
                                            <div className="flex items-center gap-2">
                                                {item.answer.is_correct ? (
                                                    <LucideCheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <LucideXCircle className="h-4 w-4 text-red-400" />
                                                )}
                                                <span
                                                    className={cn(
                                                        'text-xs font-bold',
                                                        item.answer.is_correct
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-gray-600 dark:text-gray-300',
                                                    )}
                                                >
                                                    {item.answer.content}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400 italic">
                                                <LucideHelpCircle className="h-4 w-4 opacity-50" />
                                                <span className="text-xs">{t('no_answer_selected')}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Mobile Card View (<lg) --- */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {attempt_answers.map((item, index) => (
                    <div
                        key={item.id}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-900 text-[10px] font-black text-white dark:bg-blue-600">
                                {index + 1}
                            </span>
                            <QuestionImage url={getImageUrl(item.question?.image_url ?? null)} onOpen={setSelectedImage} t={t} small />
                        </div>

                        <div className="space-y-4 p-4">
                            <div>
                                <h4 className="text-sm leading-snug font-bold text-gray-900 dark:text-gray-100">{item.question?.content}</h4>
                                {item.question?.description && (
                                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[10px] leading-relaxed text-gray-500 italic dark:bg-gray-800/50 dark:text-gray-400">
                                        <span className="mr-1 font-bold text-blue-500 not-italic">{t('description')}:</span>
                                        {item.question.description}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black tracking-wider text-gray-400 uppercase">{t('attempt_answer_and_answers')}</p>
                                <div className="grid gap-2">
                                    {item.question?.answers?.map((ans) => (
                                        <AnswerItem key={ans.id} content={ans.content} isCorrect={ans.is_correct} />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                                <p className="mb-2 text-[10px] font-black tracking-wider text-gray-400 uppercase">{t('selected_answer')}</p>
                                {item.answer ? (
                                    <div className="flex items-center gap-2">
                                        {item.answer.is_correct ? (
                                            <LucideCheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <LucideXCircle className="h-4 w-4 text-red-400" />
                                        )}
                                        <span
                                            className={cn(
                                                'text-xs font-bold',
                                                item.answer.is_correct ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-300',
                                            )}
                                        >
                                            {item.answer.content}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <LucideHelpCircle className="h-4 w-4 opacity-50" />
                                        <span className="text-xs italic">{t('no_answer_selected')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none focus:outline-none">
                    <VisuallyHidden>
                        <DialogTitle>{t('image_preview') || 'Image Preview'}</DialogTitle>
                        <DialogDescription>{t('enlarged_image') || 'Kattalashtirilgan rasm'}</DialogDescription>
                    </VisuallyHidden>
                    {selectedImage && (
                        <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                            <img src={selectedImage} alt="Full size" className="max-h-[85vh] w-full object-contain shadow-2xl transition-all" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// --- Yordamchi Komponentlar ---

const QuestionImage = ({ url, onOpen, t, small = false }: { url: string | null; onOpen: (url: string) => void; t: any; small?: boolean }) => {
    if (!url)
        return (
            <div
                className={cn(
                    'flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800/30',
                    small ? 'h-8 w-10' : 'h-12 w-16',
                )}
            >
                <LucideImage className="h-4 w-4 opacity-20" />
            </div>
        );
    return (
        <img
            src={url}
            className={cn(
                'cursor-zoom-in rounded-lg border border-gray-200 object-cover shadow-sm transition hover:scale-105 dark:border-gray-700',
                small ? 'h-8 w-12' : 'h-12 w-20',
            )}
            alt="Question"
            onClick={() => onOpen(url)}
        />
    );
};

const AnswerItem = ({ content, isCorrect }: { content: string; isCorrect: boolean }) => (
    <div
        className={cn(
            'flex items-start gap-2 rounded-lg border p-2 text-[11px] transition-all',
            isCorrect
                ? 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'border-gray-100 bg-white text-gray-500 dark:border-gray-800 dark:bg-gray-900/50',
        )}
    >
        <span
            className={cn(
                'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                isCorrect ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300',
            )}
        />
        <span>{content}</span>
    </div>
);

export default AttemptAnswerTable;
