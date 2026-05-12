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

export default function CreateYhqCategoryItemModal({ yhq_category_id }: { yhq_category_id: number }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        yhq_category_id,
        name: '',
        bhm: '',
        summa: '',
        summa_min: '',
        summa_max: '',
        discount_summa: '',
        penalty_points: '',
        description: '',
        additional_penalty: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('yhq_category_item.store'), {
            preserveScroll: true,
            onSuccess: () => { reset(); setData('yhq_category_id', yhq_category_id); clearErrors(); setOpen(false); toast.success(t('created_successfully')); },
            onError: (err: ServerError) => { nameInput.current?.focus(); toast.error(err.error || t('create_failed')); },
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <IoCreate className="h-4 w-4" /> {t('create')}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg border bg-white dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                <DialogTitle className="dark:text-white">{t('yhq_category_item')}</DialogTitle>
                <form onSubmit={submit} className="mt-4 space-y-3">
                    <div>
                        <Label className="dark:text-gray-200">{t('name')}</Label>
                        <Input ref={nameInput} value={data.name} onChange={(e) => setData('name', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
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
                        <input type="checkbox" id="yci-is-active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked as true)} />
                        <Label htmlFor="yci-is-active" className="dark:text-gray-200">{t('active_status')}</Label>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={() => { reset(); setData('yhq_category_id', yhq_category_id); clearErrors(); }} className="dark:bg-gray-800 dark:text-gray-200">{t('cancel')}</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing} className="bg-blue-600 text-white">{t('save')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
