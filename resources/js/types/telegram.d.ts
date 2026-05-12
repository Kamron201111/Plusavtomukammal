export {};

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: any;
                ready: () => void;
                expand: () => void;
                close: () => void;
                sendData: (data: string) => void;
                isVersionAtLeast: (version: string) => boolean;
                disableVerticalSwipes: () => void;
                platform: string;
                colorScheme: 'light' | 'dark';
                themeParams: {
                    bg_color?: string;
                    text_color?: string;
                    hint_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                    secondary_bg_color?: string;
                    header_bg_color?: string;
                    accent_text_color?: string;
                    section_bg_color?: string;
                    section_header_text_color?: string;
                    subtitle_text_color?: string;
                    destructive_text_color?: string;
                };
                requestFullscreen: () => void;
                MainButton: {
                    text: string;
                    show: () => void;
                    hide: () => void;
                    onClick: (callback: () => void) => void;
                    offClick: (callback: () => void) => void;
                    setText: (text: string) => void;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isActive: boolean;
                    enable: () => void;
                    disable: () => void;
                    showProgress: (leaveActive?: boolean) => void;
                    hideProgress: () => void;
                };
                BackButton: {
                    show: () => void;
                    hide: () => void;
                    onClick: (callback: () => void) => void;
                    offClick: (callback: () => void) => void;
                    isVisible: boolean;
                };
                HapticFeedback: {
                    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
                    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
                    selectionChanged: () => void;
                };
            };
        };
    }
}
