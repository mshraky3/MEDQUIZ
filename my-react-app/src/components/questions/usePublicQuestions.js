import { useEffect, useState } from 'react';
import { buildQuestionIndex } from '../../seo/publicQuestions.js';

/**
 * Load the published question sample and hand back the grouped index.
 *
 * The import is dynamic on purpose. publicQuestions.json is ~415 KB; a static
 * import would put all 240 questions in the main bundle that every visitor
 * downloads, including someone going straight to /login. As a dynamic import
 * Vite gives it its own chunk, fetched only by the /questions/* routes.
 *
 * The parsed index is cached at module scope so moving between the hub, a
 * specialty and a question page costs one fetch, not one per navigation.
 */
let cachedIndex = null;
// The raw payload is kept alongside the index because /past-papers needs the
// `collections` and `bankTotal` fields, which buildQuestionIndex() does not
// carry through — and it must not cost a second fetch of the same 415 KB.
let cachedPayload = null;
let inFlight = null;

function loadIndex() {
    if (cachedIndex) return Promise.resolve({ index: cachedIndex, payload: cachedPayload });
    if (!inFlight) {
        inFlight = import('../../seo/data/publicQuestions.json')
            .then((mod) => {
                cachedPayload = mod.default || mod;
                cachedIndex = buildQuestionIndex(cachedPayload);
                return { index: cachedIndex, payload: cachedPayload };
            })
            .catch((err) => {
                // Reset so a later navigation can retry rather than being stuck
                // on a permanently rejected promise.
                inFlight = null;
                throw err;
            });
    }
    return inFlight;
}

export default function usePublicQuestions() {
    const [state, setState] = useState(() => ({
        index: cachedIndex,
        payload: cachedPayload,
        loading: !cachedIndex,
        error: null,
    }));

    useEffect(() => {
        if (cachedIndex) return undefined;
        let alive = true;
        loadIndex()
            .then(({ index, payload }) => {
                if (alive) setState({ index, payload, loading: false, error: null });
            })
            .catch((error) => {
                if (alive) setState({ index: null, payload: null, loading: false, error });
            });
        return () => { alive = false; };
    }, []);

    return state;
}
