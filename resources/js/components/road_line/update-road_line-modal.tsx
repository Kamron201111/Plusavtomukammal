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
import { RoadLine, ServerError } from '@/types';

export default function UpdateRoadLineModal({ road_line }: { road_line: RoadLine }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: road_line.name || '',
        image_url: road_line.image_url || '',
        color: road_line.color || '#000000',
        description: road_line.description || '',
    });

    useEffect(() => {
        setData({ name: road_line.name, image_url: road_line.image_url, color: road_line.color || '#000000', description: road_line.description });
    }, [road_line]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('road_line.update', road_line.id), {
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
                    <DialogTitle className="dark:text-white">{t('road_line')}</DialogTitle>
                    <form onSubmit={submit} className="mt-4 space-y-4">
                        <div>
                            <Label className="dark:text-gray-200">{t('name')}</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} className="dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
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
