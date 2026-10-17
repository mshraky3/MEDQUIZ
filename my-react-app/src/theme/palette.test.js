/**
 * Guards the promise in src/theme/palette.css: every generated token's LIGHT
 * value is exactly the colour its name carries (--bg-dbeafe is #dbeafe), so
 * the light theme renders what it did before the dark theme existed. And every
 * token has a dark value.
 *
 * Run with `npm test` (node --test).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('./palette.css', import.meta.url), 'utf8');
const block = (re) => Object.fromEntries(
    [...(css.match(re)?.[1] || '').matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])
);
const light = block(/:root\s*\{([^}]*)\}/);
const dark = block(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/);

const parse = (v) => {
    let m = v.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
    if (m) return { hex: m[1].toLowerCase(), a: m[2] ? parseInt(m[2], 16) / 255 : 1 };
    m = v.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    if (m) return { hex: [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join(''), a: Number(m[4]) };
    return null;
};

test('the palette has tokens in both themes', () => {
    assert.ok(Object.keys(light).length > 0);
    assert.deepEqual(Object.keys(dark).sort(), Object.keys(light).sort());
});

test("every token's light value is the colour in its name", () => {
    for (const [name, value] of Object.entries(light)) {
        const m = name.match(/^--(bg|fg|line|shade|graphic)-([0-9a-f]{6})(?:-a(\d{3}))?$/);
        assert.ok(m, `unexpected token name ${name}`);
        const c = parse(value);
        assert.ok(c, `${name}: unparseable light value ${value}`);
        assert.equal(c.hex, m[2], `${name}: light value ${value}`);
        const alpha = m[3] ? Number(m[3]) / 1000 : 1;
        assert.ok(Math.abs(c.a - alpha) < 0.001, `${name}: alpha ${c.a} vs name ${alpha}`);
    }
});

test('every dark value is a colour', () => {
    for (const [name, value] of Object.entries(dark)) {
        assert.ok(parse(value), `${name}: unparseable dark value ${value}`);
    }
});
