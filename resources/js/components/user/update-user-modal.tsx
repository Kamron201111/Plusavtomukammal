import { useForm, usePage } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

import { Auth, Role, ServerError, User } from '@/types';

interface UpdateUserModalProps {
    roles: Role[];
    user: User;
}

export default function UpdateUserModal({ roles = [], user }: UpdateUserModalProps) {
    const { t } = useTranslation();
    const nameInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const initialData = {
        name: user.name ?? '',
        phone: user.phone ?? '',
        role: user.roles?.[0]?.name ?? '',
        email: user.email ?? '',
        password: '',
    };

    const { data, setData, put, processing, reset, errors, clearErrors } = useForm(initialData);

    const { auth } = usePage().props as { auth?: Auth };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');

    useEffect(() => {
        setData(initialData);
    }, [user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(`/user/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setOpen(false);
                toast.success(t('updated_successfully'));
            },
            onError: (err: ServerError) => {
                nameInput.current?.focus();
                toast.error(err.error || t('update_failed'));
            },
        });
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-500"
            >
                <PencilIcon className="h-4 w-4" />
            </button>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-lg border bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:shadow-none">
                    <DialogTitle className="text-gray-900 dark:text-gray-100">{t('modal.update_title')}</DialogTitle>
                    <DialogDescription className="mb-4 text-gray-600 dark:text-gray-300">{t('modal.update_description')}</DialogDescription>

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

                        {/* Role (Admin only) */}
                        {isAdmin && (
                            <div>
                                <Label className="text-gray-700 dark:text-gray-200">{t('role')}</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger className="w-full border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-400">
                                        <span>{data.role ? roles.find((r) => r.name === data.role)?.name : t('select_role')}</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                                {t('email')}
                            </Label>
                            <Input
                                id="email"
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
                                    onClick={() => {
                                        reset();
                                        clearErrors();
                                    }}
                                    className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                                >
                                    {t('cancel')}
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                            >
                                {t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
