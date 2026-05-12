import { useForm } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServerError, Yhq } from '@/types';

export default function UpdateYhqModal({ yhq }: { yhq: Yhq }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title: yhq.title || '',
        date: yhq.date || '',
        brv_amount: yhq.brv_amount?.toString() || '',
        brv_description: yhq.brv_description || '',
        discount_days: yhq.discount_days?.toString() || '',
        discount_percent: yhq.discount_percent?.toString() || '',
        payment_deadline_regular: yhq.payment_deadline_regular?.toString() || '',
        payment_deadline_camera: yhq.payment_deadline_camera?.toString() || '',
        cancellation_if_no_decision_days: yhq.cancellation_if_no_decision_days?.toString() || '',
        is_active: yhq.is_active,
    });

    useEffect(() => {
        setData({
            title: yhq.title || '', date: yhq.date || '',
            brv_amount: yhq.brv_amount?.toString() || '', brv_description: yhq.brv_description || '',
            discount_days: yhq.discount_days?.toString() || '', discount_percent: yhq.discount_percent?.toString() || '',
            payment_deadline_regular: yhq.payment_deadline_regular?.toString() || '',
            payment_deadline_camera: yhq.payment_deadline_camera?.toString() || '',
            cancellation_if_no_decision_days: yhq.cancellation_if_no_decision_days?.toString() || '',
            is_active: yhq.is_active,
        });
    }, [yhq]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('yhq.update', yhq.id), {
            preserveScroll: true,
            onSuccess: () => { setOpen(false); toast.success(t('updated_successfully')); },
            onError: (err: ServerError) => { toast.error(err.error || t('update_failed')); },
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
        <>
            <button onClick={() => setOpen(true)} className="rounded bg-green-600 p-2 text-white hover:bg-green-700">
                <PencilIcon className="h-4 w-4" />
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
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
                            <input type="checkbox" id={`yhq-active-${yhq.id}`} checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <Label htmlFor={`yhq-active-${yhq.id}`} className="dark:text-gray-200">{t('active_status')}</Label>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary" className="dark:bg-gray-800 dark:text-gray-200">{t('cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing} className="bg-green-600 text-white">{t('save')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
