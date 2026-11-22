/**
 * The exam's basic calculator, with no eval. A classic "immediate execution"
 * pocket calculator: type a number, press an operator, type the next number,
 * press = (or another operator, which first applies the pending one).
 *
 * state: { display: string, acc: number|null, op: string|null, fresh: boolean, error: boolean }
 */

export const initialCalc = () => ({ display: '0', acc: null, op: null, fresh: true, error: false });

const MAX_DIGITS = 14;

function apply(a, op, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? NaN : a / b;
        default: return b;
    }
}

/** A tidy decimal string: no float noise (0.1 + 0.2 shows 0.3), no exponent for ordinary sizes. */
export function formatResult(n) {
    if (!Number.isFinite(n)) return 'Error';
    const rounded = Number(n.toPrecision(12));
    let s = String(rounded);
    if (/e/i.test(s)) s = rounded.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 8 });
    return s;
}

const errorState = () => ({ ...initialCalc(), display: 'Error', error: true });

export function pressKey(state, key) {
    if (state.error && key !== 'C') return state;
    if (/^[0-9]$/.test(key)) {
        if (state.fresh) return { ...state, display: key, fresh: false };
        if (state.display.replace(/[-.]/g, '').length >= MAX_DIGITS) return state;
        return { ...state, display: state.display === '0' ? key : state.display + key };
    }
    switch (key) {
        case '.':
            if (state.fresh) return { ...state, display: '0.', fresh: false };
            return state.display.includes('.') ? state : { ...state, display: `${state.display}.` };
        case 'C':
            return initialCalc();
        case 'back': {
            if (state.fresh) return state;
            const d = state.display;
            const shortest = d.startsWith('-') ? 2 : 1;
            return { ...state, display: d.length > shortest ? d.slice(0, -1) : '0' };
        }
        case 'neg':
            if (state.display === '0') return state;
            return { ...state, display: state.display.startsWith('-') ? state.display.slice(1) : `-${state.display}` };
        case 'pct':
            return { ...state, display: formatResult(Number(state.display) / 100), fresh: true };
        case 'sqrt': {
            const v = Number(state.display);
            if (v < 0) return errorState();
            return { ...state, display: formatResult(Math.sqrt(v)), fresh: true };
        }
        case '+': case '-': case '*': case '/': {
            const current = Number(state.display);
            // two operators in a row: the second replaces the first
            if (state.op && state.fresh) return { ...state, op: key };
            const acc = state.op && state.acc !== null ? apply(state.acc, state.op, current) : current;
            if (!Number.isFinite(acc)) return errorState();
            return { ...state, acc, op: key, display: formatResult(acc), fresh: true };
        }
        case '=': {
            if (!state.op || state.acc === null) return { ...state, fresh: true };
            const result = apply(state.acc, state.op, Number(state.display));
            if (!Number.isFinite(result)) return errorState();
            return { display: formatResult(result), acc: null, op: null, fresh: true, error: false };
        }
        default:
            return state;
    }
}
