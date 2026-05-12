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

export default function CreateYhqModal() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const titleInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        title: '',
        date: '',
        brv_amount: '',
        brv_description: '',
        discount_days: '',
        discount_percent: '',
        payment_deadline_regular: '',
        payment_deadline_camera: '',
        cancellation_if_no_decision_days: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('yhq.store'), {
            preserveScroll: true,
            onSuccess: () => { reset(); clearErrors(); setOpen(false); toast.success(t('created_successfully')); },
            onError: (err: ServerError) => { titleInput.current?.focus(); toast.error(err.error || t('create_failed')); },
        });
    };

    const field = (key: keyof typeof data, label: string, type = 'text') => (
        <div>
            <Label className="dark:text-gray-200">{label}</Label>
            <Input type={type} value={data[key] as string} onChange={(e) => setData(key, e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
            <InputError message={errors[key]} />
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <IoCreate className="h-4 w-4" /> {t('create')}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg border bg-white dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                <DialogTitle className="dark:text-white">{t('yhq')}</DialogTitle>
                <form onSubmit={submit} className="mt-4 space-y-3">
                    {field('title', t('title'))}
                    {field('date', t('date'), 'date')}
                    {field('brv_amount', t('brv_amount'), 'number')}
                    <div>
                        <Label className="dark:text-gray-200">{t('brv_description')}</Label>
                        <textarea rows={2} value={data.brv_description} onChange={(e) => setData('brv_description', e.target.value)} className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                    </div>
                    {field('discount_days', t('discount_days'), 'number')}
                    {field('discount_percent', t('discount_percent'), 'number')}
                    {field('payment_deadline_regular', t('payment_deadline_regular'), 'number')}
                    {field('payment_deadline_camera', t('payment_deadline_camera'), 'number')}
                    {field('cancellation_if_no_decision_days', t('cancellation_days'), 'number')}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="yhq-is-active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked as true)} />
                        <Label htmlFor="yhq-is-active" className="dark:text-gray-200">{t('active_status')}</Label>
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
