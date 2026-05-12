import { useForm } from '@inertiajs/react';
import { ImageIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Question, ServerError } from '@/types';

/**
 * TypeScript va ESLint xatolarini tuzatish uchun:
 * 1. 'any' o'rniga Inertia qabul qiladigan turlar to'plami (Union Type) ishlatildi.
 * 2. Formadagi javoblar uchun Answer interfeysidan faqat kerakli maydonlar ajratib olindi.
 */
type InertiaValue = string | number | boolean | File | Blob | null | undefined | InertiaValue[] | { [key: string]: InertiaValue };

interface AnswerFormField {
    id?: number;
    content: string;
    is_correct: boolean;
}

type QuestionUpdateFormData = {
    _method: string;
    content: string;
    description: string;
    image: File | null;
    answers: AnswerFormField[];
} & { [key: string]: InertiaValue };

export default function UpdateQuestionModal({ question }: { question: Question }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const getInitialPreview = () => {
        if (!question.image_url) return null;
        return question.image_url.startsWith('http') ? question.image_url : `/storage/${question.image_url}`;
    };

    const [preview, setPreview] = useState<string | null>(getInitialPreview());

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<QuestionUpdateFormData>({
        _method: 'PUT',
        content: question.content || '',
        description: question.description || '',
        image: null,
        answers: question.answers?.map((a) => ({
            id: a.id,
            content: a.content,
            is_correct: Boolean(a.is_correct),
        })) || [{ content: '', is_correct: true }],
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const addAnswer = () => {
        setData('answers', [...data.answers, { content: '', is_correct: false }]);
    };

    const removeAnswer = (index: number) => {
        if (data.answers.length <= 1) return;
        const newAnswers = [...data.answers];
        const removedWasCorrect = newAnswers[index].is_correct;
        newAnswers.splice(index, 1);

        if (removedWasCorrect && newAnswers.length > 0) {
            newAnswers[0].is_correct = true;
        }
        setData('answers', newAnswers);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...data.answers];
        newAnswers[index].content = value;
        setData('answers', newAnswers);
    };

    const handleCorrectChange = (index: number) => {
        const newAnswers = data.answers.map((ans, i) => ({
            ...ans,
            is_correct: i === index,
        }));
        setData('answers', newAnswers);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('questions.update', question.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success(t('updated_successfully'));
            },
            onError: (err: ServerError) => {
                toast.error(err.error || t('update_failed'));
            },
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            reset();
            clearErrors();
            setPreview(getInitialPreview());
        }
    };

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="rounded bg-green-600 p-2 text-white hover:bg-green-700 dark:bg-green-500">
                <PencilIcon className="h-4 w-4" />
            </button>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border bg-white dark:border-gray-700 dark:bg-gray-900">
                    <DialogTitle className="dark:text-white">{t('modal.update_question')}</DialogTitle>
                    <DialogDescription className="sr-only">Savolni tahrirlash oynasi.</DialogDescription>

                    <form onSubmit={submit} className="mt-4 space-y-6">
                        <div className="space-y-2">
                            <Label className="dark:text-gray-200">{t('question_content')}</Label>
                            <textarea
                                rows={3}
                                value={data.content as string}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                            <InputError message={errors.content} />
                        </div>

                        <div className="space-y-2">
                            <Label className="dark:text-gray-200">{t('description')}</Label>
                            <textarea
                                rows={3}
                                value={data.description as string}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                placeholder={t('description')}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="space-y-2">
                            <Label className="dark:text-gray-200">{t('image')}</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-24 w-32 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer dark:bg-gray-800 dark:text-gray-200"
                                    />
                                    <InputError message={errors.image} />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4 dark:border-gray-700">
                            <div className="mb-4 flex items-center justify-between">
                                <Label className="text-base font-semibold dark:text-gray-200">{t('answers')}</Label>
                                <Button type="button" onClick={addAnswer} size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                    <PlusIcon className="mr-1 h-4 w-4" /> {t('add_option')}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {data.answers.map((answer, index) => (
                                    <div
                                        key={index}
                                        className={`relative space-y-2 rounded-lg border p-3 transition-all ${
                                            answer.is_correct
                                                ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                                                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`update_correct_${question.id}`}
                                                    checked={answer.is_correct}
                                                    onChange={() => handleCorrectChange(index)}
                                                    className="h-4 w-4 cursor-pointer accent-green-600"
                                                />
                                                <span
                                                    className={`text-[10px] font-bold uppercase ${answer.is_correct ? 'text-green-600' : 'text-gray-500'}`}
                                                >
                                                    {t('option')} {index + 1}
                                                </span>
                                            </div>
                                            {data.answers.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAnswer(index)}
                                                    className="text-gray-400 transition-colors hover:text-red-500"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        <Input
                                            value={answer.content}
                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            className="border-gray-300 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                            placeholder={t('enter_answer')}
                                        />
                                        <InputError message={errors[`answers.${index}.content` as keyof typeof errors]} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 border-t pt-4 dark:border-gray-700">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" className="dark:bg-gray-800 dark:text-gray-100">
                                    {t('cancel')}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing} className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500">
                                {t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
