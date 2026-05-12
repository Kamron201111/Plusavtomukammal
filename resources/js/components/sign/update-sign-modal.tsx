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
import { ServerError, Sign } from '@/types';

export default function UpdateSignModal({ sign }: { sign: Sign }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        sign_category_id: sign.sign_category_id,
        content: sign.content || '',
        image_url: sign.image_url || '',
        is_active: sign.is_active,
    });

    useEffect(() => {
        setData({ sign_category_id: sign.sign_category_id, content: sign.content, image_url: sign.image_url, is_active: sign.is_active });
    }, [sign]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('signs.update', sign.id), {
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
                    <DialogTitle className="dark:text-white">{t('signs')}</DialogTitle>
                    <form onSubmit={submit} className="mt-4 space-y-4">
                        <div>
                            <Label className="dark:text-gray-200">{t('content')}</Label>
                            <Input value={data.content} onChange={(e) => setData('content', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                            <InputError message={errors.content} />
                        </div>
                        <div>
                            <Label className="dark:text-gray-200">{t('image_url')}</Label>
                            <Input value={data.image_url} onChange={(e) => setData('image_url', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                            <InputError message={errors.image_url} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id={`sign-active-${sign.id}`} checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <Label htmlFor={`sign-active-${sign.id}`} className="dark:text-gray-200">{t('active_status')}</Label>
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
