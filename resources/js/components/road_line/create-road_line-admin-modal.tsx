import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCreate } from 'react-icons/io5';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServerError } from '@/types';

export default function CreateRoadLineModal() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        image_url: '',
        color: '#000000',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('road_line.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('created_successfully'));
            },
            onError: (err: ServerError) => {
                nameInput.current?.focus();
                toast.error(err.error || t('create_failed'));
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <IoCreate className="h-4 w-4" />
                    {t('create')}
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md border bg-white dark:border-gray-700 dark:bg-gray-900">
                <DialogTitle className="dark:text-white">{t('road_line')}</DialogTitle>
                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <Label className="dark:text-gray-200">{t('name')}</Label>
                        <Input ref={nameInput} value={data.name} onChange={(e) => setData('name', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label className="dark:text-gray-200">{t('image_url')}</Label>
                        <Input value={data.image_url} onChange={(e) => setData('image_url', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                        <InputError message={errors.image_url} />
                    </div>
                    <div>
                        <Label className="dark:text-gray-200">{t('color')}</Label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="h-9 w-14 cursor-pointer rounded border dark:border-gray-600" />
                            <Input value={data.color} onChange={(e) => setData('color', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <InputError message={errors.color} />
                    </div>
                    <div>
                        <Label className="dark:text-gray-200">{t('description')}</Label>
                        <textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                        <InputError message={errors.description} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={() => { reset(); clearErrors(); }} className="dark:bg-gray-800 dark:text-gray-200">{t('cancel')}</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing} className="bg-blue-600 text-white">{t('save')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
