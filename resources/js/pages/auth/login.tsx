import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import LoginCard from '@/components/auth/login-card';
import LanguageBar from '@/components/language';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t } = useTranslation();

    return (
        <AuthLayout title={t('login.title')} description={t('login.description')}>
            <Head title={t('login.submit')} />

            <LanguageBar />

            <LoginCard />

            <div className="flex items-center">
                <Label htmlFor="password">{t('login.password')}</Label>
                {canResetPassword && (
                    <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                        {t('login.forgot')}
                    </TextLink>
                )}
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{t('login.status_success')}</div>}
        </AuthLayout>
    );
}
