import { useForm } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServerError, Ticket } from '@/types';

export default function UpdateTicketModal({ ticket }: { ticket: Ticket }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const titleInput = useRef<HTMLInputElement>(null);

    const { data, setData, put, processing, reset, errors, clearErrors } = useForm({
        title: ticket.title || '',
        description: ticket.description || '',
        is_active: ticket.is_active,
    });

    useEffect(() => {
        setData({ title: ticket.title, description: ticket.description, is_active: ticket.is_active });
    }, [ticket]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('tickets.update', ticket.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success(t('updated_successfully'));
            },
            onError: (err: ServerError) => {
                titleInput.current?.focus();
                toast.error(err.error || t('update_failed'));
            },
        });
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="rounded bg-green-600 p-2 text-white hover:bg-green-700 dark:bg-green-500">
                <PencilIcon className="h-4 w-4" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md border bg-white dark:border-gray-700 dark:bg-gray-900">
                    <DialogTitle className="dark:text-white">{t('modal.update_ticket')}</DialogTitle>
                    <form onSubmit={submit} className="mt-4 space-y-4">
                        <div>
                            <Label className="dark:text-gray-200">{t('title')}</Label>
                            <Input
                                ref={titleInput}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div>
                            <Label className="dark:text-gray-200">{t('description')}</Label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`active-${ticket.id}`}
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <Label htmlFor={`active-${ticket.id}`} className="dark:text-gray-200">
                                {t('active_status')}
                            </Label>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary" className="dark:bg-gray-800 dark:text-gray-200">
                                    {t('cancel')}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing} className="bg-green-600 text-white">
                                {t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
