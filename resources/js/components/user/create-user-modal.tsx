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

export default function CreateUserModal() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const nameInput = useRef<HTMLInputElement>(null);

    const initialData = {
        name: '',
        phone: '',
        email: '',
        password: '',
    };

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm(initialData);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('user.store'), {
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

    const handleCancel = () => {
        reset();
        clearErrors();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={`${baseButton} bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400`}
                >
                    <IoCreate className="mr-1 h-4 w-4" />
                </button>
            </DialogTrigger>

            <DialogContent className="rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:shadow-none">
                <DialogTitle className="text-gray-900 dark:text-gray-100">{t('modal.create_title')}</DialogTitle>
                <DialogDescription className="mb-4 text-gray-600 dark:text-gray-300">{t('modal.create_description')}</DialogDescription>

                <form onSubmit={submit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">
                            {t('name')}
                        </Label>
                        <Input
                            id="name"
                            ref={nameInput}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-200">
                            {t('phone')}
                        </Label>
                        <Input
                            id="phone"
                            type="number"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                            {t('email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">
                            {t('password')}
                        </Label>
                        <Input
                            id="password"
                            type="number"
                            inputMode="numeric"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                            >
                                {t('cancel')}
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {t('save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
