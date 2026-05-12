import { useForm } from '@inertiajs/react';
import { ImageIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCreate } from 'react-icons/io5';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { baseButton } from '@/components/ui/baseButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServerError } from '@/types';

// Tipizatsiya (Interface'lar)
interface Answer {
    content: string;
    is_correct: boolean;
}

interface CreateQuestionFormData {
    ticket_id: number;
    content: string;
    description: string;
    image: File | null;
    answers: Answer[];
    [key: string]: any; // Massivli xatolar uchun
}

export default function CreateQuestionModal({ ticket_id }: { ticket_id: number }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<CreateQuestionFormData>({
        ticket_id: ticket_id,
        content: '',
        description: '',
        image: null,
        answers: [{ content: '', is_correct: true }],
    });

    // Rasm tanlanganda preview yaratish
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Yangi javob varianti qo'shish
    const addAnswer = () => {
        setData('answers', [...data.answers, { content: '', is_correct: false }]);
    };

    // Javob variantini o'chirish
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
        post(route('questions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                setOpen(false);
                toast.success(t('created_successfully'));
            },
            onError: (err: ServerError) => {
                const message = err.error || t('create_failed');
                toast.error(message);
            },
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            reset();
            setPreview(null);
            clearErrors();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button className={`${baseButton} bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500`}>
                    <IoCreate className="mr-1 h-4 w-4" /> {t('create')}
                </button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border bg-white dark:border-gray-700 dark:bg-gray-900">
                <DialogTitle className="dark:text-white">{t('modal.create_question_title')}</DialogTitle>

                {/* Shadcn/Accessibility xatosini tuzatish */}
                <DialogDescription className="sr-only">Yangi savol yaratish va javob variantlarini qo'shish oynasi.</DialogDescription>

                <form onSubmit={submit} className="mt-4 space-y-6">
                    {/* Savol matni */}
                    <div className="space-y-2">
                        <Label className="dark:text-gray-200">{t('question_content')}</Label>
                        <textarea
                            rows={3}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder={t('enter_question_text')}
                        />
                        <InputError message={errors.content} />
                    </div>
                    {/* Savol matni */}
                    <div className="space-y-2">
                        <Label className="dark:text-gray-200">{t('description')}</Label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder={t('description')}
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Rasm qismi va Preview */}
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

                    {/* Javoblar qismi */}
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
                                                name="create_correct_radio"
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
                                    {/* Laravel massivli xatolarini ko'rsatish */}
                                    <InputError message={errors[`answers.${index}.content`]} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 border-t pt-4 dark:border-gray-700">
                        <DialogClose asChild>
                            <Button variant="secondary" className="dark:bg-gray-800 dark:text-gray-100">
                                {t('cancel')}
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing} className="bg-blue-600 text-white hover:bg-blue-700">
                            {t('save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
