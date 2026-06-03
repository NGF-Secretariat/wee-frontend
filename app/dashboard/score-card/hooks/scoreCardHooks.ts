import { useState, useEffect } from 'react';

export type Submission = {
    _id: number;
    q3: string;
    q8: string;
    q9: string;
    q15: string;
    q16: string;
    q17: string;
    q18: string;
    q10_pre: string;
    q23_e: string;
    q13: string;
    _submission_time: string;
};

export type ProcessedState = {
    state: string;
    q8: boolean;
    q9: boolean;
    q15: boolean;
    q16: boolean;
    q17: boolean;
    q18: boolean;
    q10_pre: boolean;
    q23_e: boolean;
    q13: boolean;
};

const useScoreCardHook = () => {
    const [data, setData] = useState<ProcessedState[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/kobo');
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || 'Failed to fetch');
                }

                const result: { results: Submission[] } = await response.json();


                // deduplicate — keep most recent submission per state
                const stateMap = new Map<string, Submission>();
                for (const submission of result?.results || []) {
                    const state = submission.q3?.toLowerCase().trim();
                    if (!state) continue;

                    const existing = stateMap.get(state);
                    if (!existing) {
                        stateMap.set(state, submission);
                    } else {
                        const existingTime = new Date(existing._submission_time).getTime();
                        const newTime = new Date(submission._submission_time).getTime();
                        if (newTime > existingTime) {
                            stateMap.set(state, submission);
                        }
                    }
                }

                // transform to processed format
                const processed: ProcessedState[] = Array.from(stateMap.values())
                    .sort((a, b) => a.q3.localeCompare(b.q3))
                    .map((s) => ({
                        state: capitalize(s.q3),
                        q8: s.q8 === 'yes',
                        q9: s.q9 === 'yes',
                        q15: s.q15 === 'yes',
                        q16: s.q16 === 'yes',
                        q17: s.q17 === 'yes',
                        q18: s.q18 === 'yes',
                        q10_pre: s.q10_pre === 'yes',
                        q23_e: s.q23_e === 'yes',
                        q13: parseInt(s.q13 ?? '0', 10) >= 3600,
                    }));

                setData(processed);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    console.log('data', data);

    return { data, loading, error };
};

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default useScoreCardHook;