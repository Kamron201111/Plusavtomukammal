import { Link } from '@inertiajs/react';

export default function AppLogo() {
    return (
        <Link href="/" className="group flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-white shadow-sm transition-all dark:bg-slate-200">
                <img
                    src="/images/icons/big-logo-nobg.png"
                    alt="PlusAvto.Uz"
                    className="size-8 object-contain"
                />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-sm leading-none font-bold tracking-tight text-slate-900 dark:text-white">PlusAvto.Uz</span>
            </div>
        </Link>
    );
}
