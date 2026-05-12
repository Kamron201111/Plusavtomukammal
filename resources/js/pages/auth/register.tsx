import RegisterCard from '@/components/auth/register-card';
import LanguageBar from '@/components/language';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();

    return (
        <AuthLayout title={t('register.title')} description={t('register.description')}>
            <Head title={t('register.title')} />

            <LanguageBar />

            <RegisterCard />
        </AuthLayout>
    );
}
