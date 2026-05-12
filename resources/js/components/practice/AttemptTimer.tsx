import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { memo, useEffect, useRef, useState } from 'react';

interface TimerProps {
    endAt: number;
    attemptId: number;
}

const AttemptTimer = memo(({ endAt, attemptId }: TimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(() => Math.max(0, endAt - Date.now()));
    // Bir marta submit bo'lgandan keyin qayta yubormaslik uchun ref
    const isSubmitted = useRef(false);

    useEffect(() => {
        // Agar vaqt allaqachon tugagan bo'lsa va hali submit bo'lmagan bo'lsa
        if (endAt <= Date.now() && !isSubmitted.current) {
            submitAttempt();
            return;
        }

        const timer = setInterval(() => {
            const remaining = endAt - Date.now();

            if (remaining <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
                if (!isSubmitted.current) {
                    submitAttempt();
                }
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endAt, attemptId]);

    const submitAttempt = () => {
        if (isSubmitted.current || !attemptId) return;

        isSubmitted.current = true;

        // Inertia router orqali yuborish
        router.post(
            `/attempts/${attemptId}/submit`,
            {},
            {
                preserveScroll: true,
                preserveState: false, // Sahifani to'liq yangilash uchun
                onFinish: () => {
                    console.log('Attempt submitted successfully');
                },
            },
        );
    };

    const totalSeconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div
            className={cn(
                'flex items-center justify-center rounded-xl border-2 px-3 py-1 shadow-sm transition-all lg:rounded-full lg:px-6 lg:py-1.5',
                timeLeft < 60000 ? 'animate-pulse border-red-500 bg-red-500/10 text-red-600' : 'border-primary/20 bg-background text-primary',
            )}
        >
            <span className="font-mono text-lg font-black tabular-nums lg:text-2xl">{timeString}</span>
        </div>
    );
});

AttemptTimer.displayName = 'AttemptTimer';
export default AttemptTimer;
