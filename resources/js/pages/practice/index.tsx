import ExamInterface from '@/components/practice/ExamInterface';
import PracticeLayout from '@/layouts/practice-layout';
import { Attempt } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AttemptTimer from '@/components/practice/AttemptTimer';

export default function Practice() {
    const { attempt, remaining_seconds } = usePage<{
        attempt: Attempt;
        remaining_seconds: number;
    }>().props;

    const { t } = useTranslation();

    const [fontSize, setFontSize] = useState(15);
    const [isExplanationEnabled, setIsExplanationEnabled] = useState(false);

    const handleFontIncrease = () => setFontSize((prev) => Math.min(prev + 1, 22));
    const handleFontDecrease = () => setFontSize((prev) => Math.max(prev - 1, 12));

    // Server tomonidan hisoblangan qolgan vaqtni ishlatamiz (timezone muammosi yo'q)
    const endAt = useMemo(() => Date.now() + remaining_seconds * 1000, [remaining_seconds]);

    return (
        <PracticeLayout
            fontSize={fontSize}
            onFontIncrease={handleFontIncrease}
            onFontDecrease={handleFontDecrease}
            isExplanationEnabled={isExplanationEnabled}
            onToggleExplanation={setIsExplanationEnabled}
            mobileTimer={<AttemptTimer endAt={endAt} attemptId={attempt.id} />}
        >
            <Head title={t('attempt')} />
            <ExamInterface attempt={attempt} fontSize={fontSize} isExplanationEnabled={isExplanationEnabled} endAt={endAt} />
        </PracticeLayout>
    );
}
