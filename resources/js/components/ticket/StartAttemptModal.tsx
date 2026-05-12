import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { Zap, X, ClipboardList, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Ticket } from '@/types';

interface Props {
    ticket: Ticket;
    children?: ReactNode;
}

export default function StartAttemptModal({ ticket, children }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    // Using useForm to handle the post request to the attempt store route
    const { post, processing } = useForm({
        ticket_id: ticket.id,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Adjust the route name to match your Laravel backend (e.g., 'attempts.store')
        post(route('attempts.store'), {
            onSuccess: () => {
                setOpen(false);
                toast.success(t('attempt_started_successfully'));
            },
            onError: () => {
                toast.error(t('failed_to_start_attempt'));
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <button className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg ring-1 shadow-emerald-500/30 ring-white/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40 active:scale-95 sm:py-2.5 dark:from-emerald-600 dark:to-teal-700 dark:ring-white/10">
                        {/* Yaltiroq effekt (Shine effect on hover) */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:translate-x-full" />

                        <IoPlayCircleOutline className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        <span className="relative z-10 tracking-wide">{t('start')}</span>
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-sm overflow-hidden p-0 border-none shadow-2xl">
                {/* Modal Header - Dashboard Style */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-800 p-6 text-white">
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                    
                    <DialogClose asChild>
                        <button
                            className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 active:scale-90"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </DialogClose>

                    <div className="relative z-10">
                        <div className="mb-1 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-300" />
                            <span className="text-xs font-black tracking-widest text-indigo-200 uppercase">
                                {t('ticket_details')}
                            </span>
                        </div>
                        <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
                            {ticket.title}
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm text-indigo-100">
                            {t('modal.start_attempt_warning', { title: ticket.title })}
                        </DialogDescription>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 bg-card">
                    <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-3 rounded-xl bg-blue-50/50 p-3 ring-1 ring-blue-100 dark:bg-blue-900/10 dark:ring-blue-900/20">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500/70">
                                    {t('questions_count', 'Savollar soni')}
                                </p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    {ticket.questions_count} {t('questions_unit', 'ta')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-emerald-50/50 p-3 ring-1 ring-emerald-100 dark:bg-emerald-900/10 dark:ring-emerald-900/20">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">
                                    {t('status', 'Holati')}
                                </p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    {ticket.is_active ? t('active', 'Faol') : t('inactive', 'Nofaol')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <div className="flex gap-3">
                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className="flex-1 rounded-xl border border-border bg-muted py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted/80 active:scale-[0.98]"
                                >
                                    {t('cancel')}
                                </button>
                            </DialogClose>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-600 active:scale-[0.98] disabled:opacity-60"
                            >
                                {processing ? t('starting') : t('start')}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
