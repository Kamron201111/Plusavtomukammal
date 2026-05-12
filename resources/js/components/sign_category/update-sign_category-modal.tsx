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
import { ServerError, SignCategory } from '@/types';

export default function UpdateSignCategoryModal({ sign_category }: { sign_category: SignCategory }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: sign_category.name || '',
        is_active: sign_category.is_active,
    });

    useEffect(() => {
        setData({ name: sign_category.name, is_active: sign_category.is_active });
    }, [sign_category]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('sign_category.update', sign_category.id), {
            preserveScroll: true,
            onSuccess: () => { setOpen(false); toast.success(t('updated_successfully')); },
            onError: (err: ServerError) => { toast.error(err.error || t('update_failed')); },
        });
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="rounded bg-green-600 p-2 text-white hover:bg-green-700">
                <PencilIcon className="h-4 w-4" />
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md border bg-white dark:border-gray-700 dark:bg-gray-900">
                    <DialogTitle className="dark:text-white">{t('sign_category')}</DialogTitle>
                    <form onSubmit={submit} className="mt-4 space-y-4">
                        <div>
                            <Label className="dark:text-gray-200">{t('name')}</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                            <InputError message={errors.name} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id={`sc-active-${sign_category.id}`} checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <Label htmlFor={`sc-active-${sign_category.id}`} className="dark:text-gray-200">{t('active_status')}</Label>
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
