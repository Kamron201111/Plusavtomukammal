import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Attempt, AttemptAnswer } from '@/types';

interface Props {
    attempt: Attempt;
    answers?: AttemptAnswer[];
}

export default function FinishAttemptModal({ attempt, answers }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const targetAnswers = answers !== undefined && answers.length > 0 ? answers : attempt.attempt_answers || [];
    const unansweredCount = targetAnswers.filter((ans) => ans.answer_id === null).length || 0;

    const handleFinish = () => {
        router.post(route('attempts.submit', attempt.id), {}, { onSuccess: () => setOpen(false) });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full rounded-md bg-green-600 px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700 active:scale-95 lg:w-auto">
                    {t('finish')}
                </button>
            </DialogTrigger>

            {/* Changed: Adjusted max-width, width for mobile, and reduced padding */}
            <DialogContent className="w-[92%] max-w-md rounded-lg border bg-white p-4 shadow-lg lg:p-6 dark:border-gray-700 dark:bg-gray-900">
                <DialogHeader>
                    {/* Reduced icon size on mobile */}
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 lg:mb-4 lg:h-12 lg:w-12 dark:bg-green-900/30">
                        <IoCheckmarkCircleOutline className="h-5 w-5 text-green-600 lg:h-6 lg:w-6 dark:text-green-400" />
                    </div>
                    <DialogTitle className="text-center text-lg font-bold lg:text-xl dark:text-white">{t('modal.finish_title')}</DialogTitle>
                    <DialogDescription className="pt-1 text-center text-sm text-gray-600 lg:pt-2 dark:text-gray-400">
                        {t('modal.finish_description')}
                    </DialogDescription>
                </DialogHeader>

                {unansweredCount > 0 && (
                    <div className="my-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 lg:my-4 lg:p-4 dark:border-yellow-900/30 dark:bg-yellow-900/10">
                        <p className="text-center text-xs font-medium text-yellow-700 lg:text-sm dark:text-yellow-500">
                            {t('modal.unanswered_warning', { count: unansweredCount })}
                        </p>
                    </div>
                )}

                {/* Changed: Better mobile button stacking */}
                <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center sm:gap-3 lg:mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost" className="h-9 text-sm lg:h-10 dark:text-gray-400">
                            {t('cancel')}
                        </Button>
                    </DialogClose>
                    <Button onClick={handleFinish} className="h-9 bg-green-600 px-8 text-sm text-white hover:bg-green-700 lg:h-10">
                        {t('confirm_finish')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
