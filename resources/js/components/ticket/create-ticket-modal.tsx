import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
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

export default function CreateTicketModal() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const titleInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        title: '',
        description: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('tickets.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('created_successfully'));
            },
            onError: (err: ServerError) => {
                titleInput.current?.focus();
                toast.error(err.error || t('create_failed'));
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className={`${baseButton} bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`}>
                    <IoCreate className="mr-1 h-4 w-4" />
                    {t('create')}
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md border bg-white dark:border-gray-700 dark:bg-gray-900">
                <DialogTitle className="dark:text-white">{t('modal.create_ticket_title')}</DialogTitle>
                <DialogDescription className="dark:text-gray-400">{t('modal.create_ticket_description')}</DialogDescription>

                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <Label htmlFor="title" className="dark:text-gray-200">
                            {t('title')}
                        </Label>
                        <Input
                            id="title"
                            ref={titleInput}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div>
                        <Label htmlFor="description" className="dark:text-gray-200">
                            {t('description')}
                        </Label>
                        <textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    reset();
                                    clearErrors();
                                }}
                                className="dark:bg-gray-800 dark:text-gray-200"
                            >
                                {t('cancel')}
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing} className="bg-blue-600 text-white">
                            {t('save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
