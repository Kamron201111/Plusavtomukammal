import AppLogoIcon from '@/components/app-logo-icon';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow">
                                <AppLogoIcon className="size-10 object-contain" />
                            </div>
                            <span className="sr-only">PlusAvto.Uz</span>
                        </Link>
                        {title && (
                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-bold">{title}</h1>
                                {description && (
                                    <p className="text-muted-foreground text-center text-sm">{description}</p>
                                )}
                            </div>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
