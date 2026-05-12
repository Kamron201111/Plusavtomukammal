import { router } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Telegram Mini App ichida ekanligini aniqlash
 */
export function isTelegramWebApp(): boolean {
    return !!window.Telegram?.WebApp?.initData;
}

/**
 * Telegram BackButton — ichki sahifalarda orqaga tugmasini ko'rsatish
 */
export function useTelegramBackButton(backUrl?: string) {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg || !backUrl) return;

        // BackButton supported from 6.1
        if (!tg.isVersionAtLeast('6.1')) return;

        tg.BackButton.show();
        const handler = () => router.visit(backUrl);
        tg.BackButton.onClick(handler);

        return () => {
            tg.BackButton.hide();
        };
    }, [backUrl]);
}

/**
 * Telegram HapticFeedback
 */
export function useTelegramHaptic() {
    const tg = window.Telegram?.WebApp;
    
    // Check if version is at least 6.1
    const isSupported = tg && tg.isVersionAtLeast('6.1');

    return {
        /** Engil tebranish (tugma bosish) */
        light: () => isSupported && tg?.HapticFeedback?.impactOccurred('light'),
        /** O'rtacha tebranish (javob tanlash) */
        medium: () => isSupported && tg?.HapticFeedback?.impactOccurred('medium'),
        /** Kuchli tebranish */
        heavy: () => isSupported && tg?.HapticFeedback?.impactOccurred('heavy'),
        /** Muvaffaqiyat (to'g'ri javob) */
        success: () => isSupported && tg?.HapticFeedback?.notificationOccurred('success'),
        /** Xatolik (noto'g'ri javob) */
        error: () => isSupported && tg?.HapticFeedback?.notificationOccurred('error'),
        /** Ogohlantirish */
        warning: () => isSupported && tg?.HapticFeedback?.notificationOccurred('warning'),
    };
}

/**
 * Initializes the Telegram Mini App by expanding it and configuring swipes.
 */
export function initTelegramWebApp() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.expand();
    
    // disableVerticalSwipes is available in SDK 7.7+
    if (tg.isVersionAtLeast('7.7') && tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes();
    }
}
