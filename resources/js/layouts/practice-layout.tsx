import LanguageBar from '@/components/language';
import { Label } from '@/components/ui/label';
import { type ReactNode } from 'react';
import { AArrowDown, AArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PracticeLayoutProps {
    children: ReactNode;
    fontSize: number;
    onFontIncrease: () => void;
    onFontDecrease: () => void;
    isExplanationEnabled: boolean;
    onToggleExplanation: (val: boolean) => void;
    mobileTimer?: ReactNode;
}

export default function PracticeLayout({ children, fontSize, onFontIncrease, onFontDecrease, isExplanationEnabled, onToggleExplanation, mobileTimer }: PracticeLayoutProps) {
    const { t } = useTranslation();
    return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
            {/* Minimal header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 border-b border-border/50 backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 lg:pr-[10%] h-12 w-full">
                    {/* Chap tomon (Mobile timer) */}
                    <div className="flex lg:hidden items-center">
                        {mobileTimer}
                    </div>

                    {/* O'ng tomon (Switch + Font size + Language) */}
                    <div className="flex items-center justify-end gap-3 ml-auto">
                        {/* Tavsif toggle switch */}
                        <div className="flex flex-col items-center justify-center gap-0.5 mr-1 group">
                            <Label htmlFor="explanation-mode" className="text-[10px] uppercase tracking-wider font-bold cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors">
                                {t('tavsif') || 'Tavsif'}
                            </Label>
                            <button
                                id="explanation-mode"
                                type="button"
                                role="switch"
                                aria-checked={isExplanationEnabled}
                                onClick={() => onToggleExplanation(!isExplanationEnabled)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                    isExplanationEnabled ? 'bg-blue-600' : 'bg-muted'
                                }`}
                            >
                                <span className="sr-only">Toggle explanation</span>
                                <span
                                    className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform ${
                                        isExplanationEnabled ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                        {/* Font size controls */}
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={onFontDecrease}
                                disabled={fontSize <= 12}
                                title={t('font_decrease')}
                                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <AArrowDown className="h-4 w-4" />
                            </button>
                            <span className="text-[10px] font-bold text-muted-foreground w-6 text-center tabular-nums">{fontSize}</span>
                            <button
                                onClick={onFontIncrease}
                                disabled={fontSize >= 22}
                                title={t('font_increase')}
                                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <AArrowUp className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="w-px h-6 bg-border/50" />

                        {/* Language selector */}
                        <LanguageBar />
                    </div>
                </div>
            </header>

            {/* Header spacer */}
            <div className="h-12 shrink-0" />

            {/* Main content */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
