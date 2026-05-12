import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import '../css/app.css';
import './i18n';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { initializeTheme } from './hooks/use-appearance';
import { initTelegramWebApp } from './hooks/use-telegram';

initTelegramWebApp();

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('copy', (e) => e.preventDefault());

document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
});

document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
    }
});

import { TelegramThemeProvider } from './components/telegram-theme-provider';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <TelegramThemeProvider>
                <App {...props} />
                <Toaster richColors position="bottom-right" />
            </TelegramThemeProvider>,
        );
    },

    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
