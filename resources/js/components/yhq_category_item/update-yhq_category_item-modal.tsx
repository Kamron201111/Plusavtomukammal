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
import { ServerError, YhqCategoryItem } from '@/types';

export default function UpdateYhqCategoryItemModal({ item }: { item: YhqCategoryItem }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        yhq_category_id: item.yhq_category_id,
        name: item.name || '',
        bhm: item.bhm?.toString() || '',
        summa: item.summa?.toString() || '',
        summa_min: item.summa_min?.toString() || '',
        summa_max: item.summa_max?.toString() || '',
        discount_summa: item.discount_summa?.toString() || '',
        penalty_points: item.penalty_points?.toString() || '',
        description: item.description || '',
        additional_penalty: item.additional_penalty || '',
        is_active: item.is_active,
    });

    useEffect(() => {
        setData({
            yhq_category_id: item.yhq_category_id, name: item.name || '',
            bhm: item.bhm?.toString() || '', summa: item.summa?.toString() || '',
            summa_min: item.summa_min?.toString() || '', summa_max: item.summa_max?.toString() || '',
            discount_summa: item.discount_summa?.toString() || '', penalty_points: item.penalty_points?.toString() || '',
            description: item.description || '', additional_penalty: item.additional_penalty || '',
            is_active: item.is_active,
        });
    }, [item]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('yhq_category_item.update', item.id), {
            preserveScroll: true,
            onSuccess: () => { setOpen(false); toast.success(t('updated_successfully')); },
            onError: (err: ServerError) => { toast.error(err.error || t('update_failed')); },
        });
    };

    const numField = (key: keyof typeof data, label: string) => (
        <div>
            <Label className="dark:text-gray-200">{label}</Label>
            <Input type="number" value={data[key] as string} onChange={(e) => setData(key, e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
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
                    <DialogTitle className="dark:text-white">{t('yhq_category_item')}</DialogTitle>
                    <form onSubmit={submit} className="mt-4 space-y-3">
                        <div>
                            <Label className="dark:text-gray-200">{t('name')}</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                            <InputError message={errors.name} />
                        </div>
                        {numField('bhm', t('bhm'))}
                        {numField('summa', t('summa'))}
                        {numField('summa_min', t('summa_min'))}
                        {numField('summa_max', t('summa_max'))}
                        {numField('discount_summa', t('discount_summa'))}
                        {numField('penalty_points', t('penalty_points'))}
                        <div>
                            <Label className="dark:text-gray-200">{t('description')}</Label>
                            <textarea rows={2} value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                            <Label className="dark:text-gray-200">{t('additional_penalty')}</Label>
                            <Input value={data.additional_penalty} onChange={(e) => setData('additional_penalty', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id={`yci-active-${item.id}`} checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <Label htmlFor={`yci-active-${item.id}`} className="dark:text-gray-200">{t('active_status')}</Label>
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
