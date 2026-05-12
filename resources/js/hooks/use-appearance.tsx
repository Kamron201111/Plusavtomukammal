import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    // Agar Telegram Mini App ichida bo'lsa, Telegram temasini olamiz
    const tg = window.Telegram?.WebApp;
    if (tg?.colorScheme) {
        return tg.colorScheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

const handleTelegramThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    // Faqat agar 'system' (avto) rejimda bo'lsak, Telegram temasini qo'llaymiz
    if (!currentAppearance || currentAppearance === 'system') {
        applyTheme('system');
    }
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';

    applyTheme(savedAppearance);

    // Add the event listener for system theme changes...
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);

    // Telegram tema o'zgarganda xabardor bo'lish
    (window.Telegram?.WebApp as any)?.onEvent('themeChanged', handleTelegramThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
    }, []);

    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');

        const cleanup = () => {
            mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
            (window.Telegram?.WebApp as any)?.offEvent('themeChanged', handleTelegramThemeChange);
        };

        return cleanup;
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
