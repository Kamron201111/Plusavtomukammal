import DeleteItemModal from '@/components/delete-item-modal';
import CreateQuestionModal from '@/components/question/CreateQuestionModal';
import UpdateQuestionModal from '@/components/question/UpdateQuestionModal';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Question } from '@/types';
import { useForm } from '@inertiajs/react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface QuestionTableProps {
    questions: Question[];
    ticket_id: number;
}

const QuestionTable = ({ questions, ticket_id }: QuestionTableProps) => {
    const { t } = useTranslation();
    const { delete: deleteQuestion } = useForm();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleDelete = (id: number) => {
        deleteQuestion(route('questions.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success(t('deleted_successfully')),
            onError: () => toast.error(t('delete_failed')),
        });
    };

    const getImageUrl = (path: string | null) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm dark:text-gray-100">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="w-12 border-b p-4 text-center font-semibold dark:border-gray-700">#</th>
                            <th className="w-24 border-b p-4 text-center font-semibold dark:border-gray-700">{t('image')}</th>
                            <th className="border-b p-4 font-semibold dark:border-gray-700">{t('question_and_answers')}</th>
                            <th className="w-32 border-b p-4 text-center font-semibold dark:border-gray-700">
                                <CreateQuestionModal ticket_id={ticket_id} />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                        {questions.map((item, index) => (
                            <tr key={item.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                <td className="p-4 text-center text-gray-500 dark:text-gray-400">{index + 1}</td>
                                <td className="p-4">
                                    <div className="flex justify-center">
                                        {item.image_url ? (
                                            <img
                                                src={getImageUrl(item.image_url)!}
                                                className="h-12 w-16 cursor-zoom-in rounded-md border border-gray-200 object-cover shadow-sm transition-transform hover:scale-105 dark:border-gray-600"
                                                alt="Question"
                                                onClick={() => setSelectedImage(getImageUrl(item.image_url))}
                                            />
                                        ) : (
                                            <div className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-[10px] text-gray-400 dark:border-gray-600 dark:bg-gray-900/50">
                                                {t('no_image')}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    {/* Savol matni */}
                                    <div className="mb-3 font-medium text-gray-900 dark:text-gray-100">{item.content}</div>

                                    {/* Tavsif (Optimallashgan dizayn) */}
                                    {item.description && (
                                        <div className="mb-4 flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50/30 p-2 text-xs text-gray-600 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-gray-400">
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                                            <span className="italic">{item.description}</span>
                                        </div>
                                    )}

                                    {/* Javob variantlari */}
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {item.answers?.map((ans) => (
                                            <div
                                                key={ans.id}
                                                className={`flex items-start gap-2 rounded-md border p-2 text-xs transition-all ${
                                                    ans.is_correct
                                                        ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'border-gray-100 bg-gray-50/50 text-gray-500 dark:border-gray-700 dark:bg-gray-900/40'
                                                }`}
                                            >
                                                <span
                                                    className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${ans.is_correct ? 'bg-green-500' : 'bg-gray-300'}`}
                                                />
                                                <span>{ans.content}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <UpdateQuestionModal question={item} />
                                        <DeleteItemModal item={item} onDelete={() => handleDelete(item.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none focus:outline-none">
                    <VisuallyHidden>
                        <DialogTitle>Image Preview</DialogTitle>
                        <DialogDescription>Kattalashtirilgan rasm</DialogDescription>
                    </VisuallyHidden>
                    <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                        {selectedImage && <img src={selectedImage} alt="Full size" className="max-h-[85vh] w-full object-contain shadow-2xl" />}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuestionTable;
