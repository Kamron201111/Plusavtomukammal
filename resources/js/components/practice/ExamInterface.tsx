import AttemptTimer from '@/components/practice/AttemptTimer';
import FinishAttemptModal from '@/components/practice/FinishAttemptModal';
import { useTelegramBackButton, useTelegramHaptic } from '@/hooks/use-telegram';
import { cn } from '@/lib/utils';
import { Attempt, AttemptAnswer } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

interface Props {
    attempt: Attempt;
    fontSize?: number;
    isExplanationEnabled?: boolean;
    endAt?: number;
}

export default function ExamInterface({ attempt, fontSize = 15, isExplanationEnabled = false, endAt }: Props) {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const haptic = useTelegramHaptic();
    const mobileScrollRef = useRef<HTMLDivElement>(null);
    const desktopScrollRef = useRef<HTMLDivElement>(null);

    // Telegram BackButton — orqaga qaytish
    useTelegramBackButton(route('attempts.index'));

    // Modal holatlari
    const [showExplanation, setShowExplanation] = useState(false);
    const [optimisticAnswerId, setOptimisticAnswerId] = useState<number | null>(null);

    const [answers, setAnswers] = useState<AttemptAnswer[]>(attempt.attempt_answers || []);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    useEffect(() => {
        setAnswers(attempt.attempt_answers || []);
    }, [attempt.attempt_answers]);

    useEffect(() => {
        setOptimisticAnswerId(null);
    }, [currentIndex]);

    // Active tugmani ko'zga ko'rinadigan qilish (auto-scroll)
    useEffect(() => {
        const scrollToActive = (ref: React.RefObject<HTMLDivElement | null>) => {
            const container = ref.current;
            if (!container) return;
            const activeBtn = container.querySelector<HTMLElement>('[data-active="true"]');
            if (!activeBtn) return;
            const containerLeft = container.scrollLeft;
            const containerWidth = container.clientWidth;
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const targetScroll = btnLeft - containerWidth / 2 + btnWidth / 2;
            container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
        };
        scrollToActive(mobileScrollRef);
        scrollToActive(desktopScrollRef);
    }, [currentIndex]);

    // endAt endi props orqali keladi (server tomonida hisoblangan, timezone muammosi yo'q)
    const computedEndAt = endAt ?? Date.now();

    if (answers.length === 0) {
        return <div className="text-muted-foreground flex h-full items-center justify-center">{t('no_questions_found')}</div>;
    }

    const currentAttemptAnswer: AttemptAnswer = answers[currentIndex];
    const question = currentAttemptAnswer?.question;

    const handleNextQuestion = useCallback((fromIndex?: number) => {
        setShowExplanation(false);
        setCurrentIndex((prev) => {
            // Agar fromIndex berilgan bo'lsa, faqat o'sha savoldan o'tayotgan bo'lsakgina keyingisiga o'tamiz
            // Bu f1 ni ko'p bosib tashlaganda bir nechta savol sakrab ketishining oldini oladi
            if (fromIndex !== undefined && prev !== fromIndex) {
                return prev;
            }
            if (prev < answers.length - 1) {
                return prev + 1;
            }
            return prev;
        });
    }, [answers.length]);

    const handleAnswerSelect = useCallback((answerId: number) => {
        // Faqat 1 marta javob qabul qilinadi
        if (currentAttemptAnswer?.answer_id || optimisticAnswerId !== null) {
            return;
        }

        const selectedAnswer = question?.answers?.find((a) => a.id === answerId);
        setOptimisticAnswerId(answerId);

        setAnswers((prev) => {
            const next = [...prev];
            next[currentIndex] = { ...next[currentIndex], answer_id: answerId };
            return next;
        });

        // Haptic feedback: faqat noto'g'ri javobda vibratsiya bo'lsin
        if (!selectedAnswer?.is_correct) {
            haptic.error();
        }

        axios.post(route('attempt_answers.update_ajax', currentAttemptAnswer.id), { answer_id: answerId })
            .then(() => {
                if (isExplanationEnabled) {
                    setShowExplanation(true);
                } else {
                    // Qaysi savolda ekanligimizni saqlab qolamiz (timeout ichida ishlatish uchun)
                    const scheduledFromIndex = currentIndex;
                    // Qisqa tanaffusdan so'ng avtomatik keyingisiga o'tish
                    setTimeout(() => {
                        handleNextQuestion(scheduledFromIndex);
                    }, 400);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [optimisticAnswerId, currentAttemptAnswer, question, isExplanationEnabled, currentIndex, haptic, handleNextQuestion]);

    // F1–F9 klaviatura shortcutlari va Modal uchun Enter
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showExplanation) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentSelectedId !== null) {
                        handleNextQuestion();
                    } else {
                        setShowExplanation(false);
                    }
                }
                return;
            }
            const fKeys: Record<string, number> = {
                F1: 0, F2: 1, F3: 2, F4: 3, F5: 4,
                F6: 5, F7: 6, F8: 7, F9: 8,
            };
            if (e.key in fKeys) {
                e.preventDefault();
                const idx = fKeys[e.key];
                const answerList = question?.answers;
                if (answerList && idx < answerList.length) {
                    handleAnswerSelect(answerList[idx].id);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showExplanation, handleNextQuestion, question, handleAnswerSelect]);

    // Joriy holat uchun to'g'ri/noto'g'ri ekanligini hisoblaymiz (derived state)
    // Bu savol o'zgarganda yoki javob belgilanganda doim yangi bo'lishini ta'minlaydi
    const currentSelectedId = optimisticAnswerId !== null ? optimisticAnswerId : currentAttemptAnswer?.answer_id;
    const currentSelectedObject = question?.answers?.find((a) => a.id === currentSelectedId);
    const isCorrectValue = !!currentSelectedObject?.is_correct;

    return (
        <div className="flex flex-col w-full" style={{ fontSize: `${fontSize}px` }}>
            {/* ===== DESKTOP LAYOUT ===== */}
            <div className="hidden lg:flex lg:flex-col lg:min-h-[calc(100vh-48px)]">
                {/* Desktop Header: eski holat — savol (flex-1) | timer (o'ng panel) */}
                <div className="border-border bg-card block shrink-0 border-b lg:flex lg:items-stretch lg:p-0">
                    <div className="lg:bg-muted/30 hidden lg:order-2 lg:flex lg:basis-[15%] lg:items-center lg:justify-center lg:border-l lg:px-4">
                        <AttemptTimer endAt={computedEndAt} attemptId={attempt.id} />
                    </div>
                    <div className="flex-1 lg:p-6">
                        <div className="flex items-start gap-4">
                            <h1
                                className="flex-1 font-semibold leading-snug md:text-lg lg:text-xl lg:text-center"
                                style={{ fontSize: `${fontSize + 2}px` }}
                            >
                                {question?.content}
                            </h1>
                            <button
                                onClick={() => setShowExplanation(true)}
                                className="flex items-center justify-center bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 size-10 rounded-full shrink-0 transition-all active:scale-90"
                                title={t('tavsif')}
                            >
                                <Info className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Main: CHAP = javoblar, O'NG = rasm */}
                <div className="flex flex-1 min-h-0">
                    {/* CHAP: javoblar */}
                    <div className="w-[420px] shrink-0 flex flex-col gap-3 p-6 overflow-y-auto border-r border-border">
                        {question?.answers?.map((answer, index) => (
                            <button
                                key={answer.id}
                                onClick={() => handleAnswerSelect(answer.id)}
                                className={cn(
                                    'group border-border bg-card hover:border-primary flex shrink-0 items-stretch rounded-lg border text-left transition-all active:scale-[0.98]',
                                    currentAttemptAnswer.answer_id === answer.id || optimisticAnswerId === answer.id
                                        ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                                        : 'hover:bg-muted/50',
                                )}
                            >
                                <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex w-12 shrink-0 items-center justify-center font-bold">
                                    F{index + 1}
                                </div>
                                <div
                                    className="text-foreground/80 flex-1 p-3"
                                    style={{ fontSize: `${fontSize}px` }}
                                >
                                    {answer.content}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* O'NG: rasm */}
                    <div className="flex-1 flex items-center justify-center p-6 bg-muted/10 relative">
                        {question?.image_url && (
                             <img
                                src={`/storage/${question?.image_url}`}
                                alt="Question"
                                onClick={() => setZoomedImage(`/storage/${question?.image_url}`)}
                                className="max-h-[55vh] w-auto max-w-full object-contain rounded-lg shadow-sm cursor-zoom-in hover:scale-[1.02] transition-transform"
                            />
                        )}
                    </div>
                </div>

                {/* Desktop Footer */}
                <div className="sticky bottom-0 z-20 border-border bg-card/95 backdrop-blur-sm border-t px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="bg-secondary text-secondary-foreground rounded px-4 py-2 text-sm font-medium transition disabled:opacity-30"
                            >
                                {t('previous')}
                            </button>
                            <button
                                onClick={() => currentIndex < answers.length - 1 && setCurrentIndex(currentIndex + 1)}
                                disabled={currentIndex === answers.length - 1}
                                className="bg-secondary text-secondary-foreground rounded px-4 py-2 text-sm font-medium transition disabled:opacity-30"
                            >
                                {t('next')}
                            </button>
                        </div>

                        {/* Savol navigatsiya tugmalari */}
                        <div ref={desktopScrollRef} className="flex-1 overflow-x-auto px-2 py-1.5">
                            <div className="flex gap-1.5 w-max mx-auto">
                                {answers.map((ans, idx) => {
                                    const selectedAnswer = ans.question?.answers?.find((a) => a.id === ans.answer_id);
                                    const isActive = currentIndex === idx;
                                    const isAnswered = ans.answer_id !== null;
                                    const isCorrect = selectedAnswer?.is_correct;

                                    return (
                                        <button
                                            key={ans.id}
                                            data-active={isActive ? 'true' : 'false'}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={cn(
                                                'flex h-8 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm',
                                                isActive && 'ring-2 ring-blue-400 z-10',
                                                !isAnswered
                                                    ? (isActive ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80')
                                                    : (isCorrect ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-600 text-white hover:bg-rose-700')
                                            )}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <FinishAttemptModal attempt={attempt} answers={answers} />
                    </div>
                </div>
            </div>

            {/* ===== MOBILE LAYOUT ===== */}
            <div className="flex flex-col lg:hidden min-h-[calc(100vh-48px)]">
                {/* Mobile Header: savol */}
                <div className="border-border bg-card shrink-0 border-b p-4" style={{ paddingTop: 'calc(1rem + var(--tg-safe-area-inset-top, env(safe-area-inset-top, 0px)))' }}>
                    <div className="flex items-start gap-3">
                        <h1
                            className="flex-1 font-semibold leading-snug"
                            style={{ fontSize: `${fontSize + 1}px` }}
                        >
                            {question?.content}
                        </h1>

                        {/* Tavsif tugmasi har doim savol yonida bo'ladi */}
                        <button
                            onClick={() => setShowExplanation(true)}
                            className="flex items-center justify-center bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 size-9 rounded-full shrink-0 transition-all active:scale-90 self-start"
                        >
                            <Info className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile: rasm (agar mavjud bo'lsa) */}
                {question?.image_url && (
                    <div className="border-border bg-card/50 border-b p-3">
                        <div className="relative">
                            <img
                                src={`/storage/${question?.image_url}`}
                                alt="Question"
                                onClick={() => setZoomedImage(`/storage/${question?.image_url}`)}
                                className="w-full max-h-52 object-contain rounded-md cursor-zoom-in"
                            />
                        </div>
                    </div>
                )}

                {/* Mobile: javoblar — sahifa bilan uzayadi, scroll yo'q */}
                <div className="flex flex-col gap-2 p-4">
                    {question?.answers?.map((answer, index) => (
                        <button
                            key={answer.id}
                            onClick={() => handleAnswerSelect(answer.id)}
                            className={cn(
                                'group border-border bg-card hover:border-primary flex items-stretch rounded-md border text-left transition-all active:scale-[0.98]',
                                currentAttemptAnswer.answer_id === answer.id || optimisticAnswerId === answer.id
                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                    : 'hover:bg-muted',
                            )}
                        >
                            <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex w-10 shrink-0 items-center justify-center font-bold text-sm">
                                F{index + 1}
                            </div>
                            <div
                                className="text-foreground/80 flex-1 p-3 leading-snug"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {answer.content}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Mobile Footer: savol navigatsiya */}
                <div className="sticky bottom-0 z-20 border-border bg-card/95 backdrop-blur-md border-t p-4 mt-auto" style={{ paddingBottom: 'calc(1rem + var(--tg-safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)))' }}>
                    <div ref={mobileScrollRef} className="overflow-x-auto py-1.5 mb-3">
                        <div className="flex gap-1.5 w-max mx-auto">
                            {answers.map((ans, idx) => {
                                const selectedAnswer = ans.question?.answers?.find((a) => a.id === ans.answer_id);
                                const isActive = currentIndex === idx;
                                const isAnswered = ans.answer_id !== null;
                                const isCorrect = selectedAnswer?.is_correct;

                                return (
                                    <button
                                        key={ans.id}
                                        data-active={isActive ? 'true' : 'false'}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={cn(
                                            'flex h-8 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-all shadow-sm',
                                            isActive && 'ring-2 ring-blue-400 z-10',
                                            !isAnswered
                                                ? (isActive ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80')
                                                : (isCorrect ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-600 text-white hover:bg-rose-700')
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <FinishAttemptModal attempt={attempt} answers={answers} />
                </div>
            </div>

            {/* Explanation Modal Overlay */}
            {showExplanation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-card border-border animate-in fade-in zoom-in relative w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl duration-200">
                        {/* Yopish tugmasi */}
                        <button
                            onClick={() => setShowExplanation(false)}
                            className="absolute top-3 right-3 z-10 text-white/70 transition-colors hover:text-white"
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {currentSelectedId !== null ? (
                            <div className={cn('p-4 text-center font-bold text-white', isCorrectValue ? 'bg-emerald-600' : 'bg-rose-600')}>
                                {isCorrectValue ? t('correct_answer') : t('wrong_answer')}
                            </div>
                        ) : (
                            <div className="bg-blue-600 p-4 text-center font-bold text-white uppercase tracking-wider">
                                {t('tavsif')}
                            </div>
                        )}

                        <div className="p-6">
                            <h3 className="text-foreground mb-3 text-lg font-semibold">{t('description')}</h3>
                            <div
                                className="bg-muted/50 text-foreground/80 max-h-[40vh] overflow-y-auto rounded-lg p-4 leading-relaxed"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {question?.description || t('no_description_available')}
                            </div>
                        </div>

                        <div className="border-border border-t p-4">
                            <button
                                onClick={() => {
                                    if (currentSelectedId !== null) {
                                        handleNextQuestion();
                                    } else {
                                        setShowExplanation(false);
                                    }
                                }}
                                className="bg-primary text-primary-foreground w-full rounded-lg py-3 font-semibold transition hover:opacity-90 active:scale-[0.98]"
                            >
                                {t('understand_and_continue')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ZOOM MODAL */}
            {zoomedImage && (
                <div
                    onClick={() => setZoomedImage(null)}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 cursor-zoom-out"
                >
                    <img
                        src={zoomedImage}
                        alt="Zoomed"
                        className="max-h-[95vh] max-w-[95vw] object-contain select-none"
                        onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
                    />
                </div>
            )}
        </div>
    );
}
