"""Soundtracks for ad-96.html and ad-chat.html (stdlib only).

usage: python3 sfx.py 96|chat out.wav
"""
import math, random, struct, sys, wave

SR = 44100

class Track:
    def __init__(self, dur):
        self.n = int(SR * dur); self.buf = [0.0] * self.n

    def add(self, start, length, fn, gain=1.0):
        s = int(start * SR)
        for i in range(int(length * SR)):
            if 0 <= s + i < self.n:
                self.buf[s + i] += gain * fn(i / SR)

    def save(self, path):
        peak = max(abs(x) for x in self.buf) or 1
        with wave.open(path, 'w') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes(b''.join(struct.pack('<h', int(x / peak * 0.85 * 32767)) for x in self.buf))

rnd = random.Random(5)
noise = lambda: rnd.random() * 2 - 1
kick = lambda t: math.sin(2 * math.pi * (50 + 100 * math.exp(-t * 30)) * t) * math.exp(-t * 8)
hat = lambda t: noise() * math.exp(-t * 60)
clap = lambda t: noise() * (math.exp(-t * 25) + .6 * math.exp(-max(0, t - .012) * 40))
tick = lambda t: math.sin(2 * math.pi * 2200 * t) * math.exp(-t * 90)
key = lambda t: (noise() * .6 + math.sin(2 * math.pi * 3000 * t) * .4) * math.exp(-t * 180)
pop = lambda t: math.sin(2 * math.pi * (600 + 900 * math.exp(-t * 40)) * t) * math.exp(-t * 28)
def whoosh(t, L=.45): return noise() * math.sin(math.pi * min(t / L, 1)) ** 2 * .6
def bell(freqs, decay=4):
    return lambda t: sum(math.sin(2 * math.pi * f * t) * math.exp(-t * (decay + k)) for k, f in enumerate(freqs)) / len(freqs)
def pad(freqs, L):
    return lambda t: sum(math.sin(2 * math.pi * f * t) + .3 * math.sin(4 * math.pi * f * t) for f in freqs) / len(freqs) \
        * min(1, t / .25) * min(1, (L - t) / .25)

def beat(tr, start, end, bpm, clap_on=True, skip=()):
    b = 60 / bpm; k = 0
    while start + k * b < end:
        t = start + k * b
        if not any(a <= t < z for a, z in skip):
            tr.add(t, .4, kick, .9)
            tr.add(t + b / 2, .08, hat, .2)
            if clap_on and k % 2 == 1: tr.add(t, .2, clap, .35)
        k += 1

def chords(tr, parts, gain=.1):
    for a, b, fr in parts: tr.add(a, b - a, pad(fr, b - a), gain)

def ad96():
    tr = Track(18)
    beat(tr, 0, 18, 128, skip=[(7.4, 9.2)])                    # beat drops out while the slot spins
    D, G, A, Bm = (293.7, 370, 440), (196, 246.9, 293.7), (220, 277.2, 329.6), (246.9, 293.7, 370)
    chords(tr, [(0, 3.2, D), (3.2, 7.2, G), (7.2, 10.8, A), (10.8, 14.6, Bm), (14.6, 18, D)])
    for c in (3.2, 7.2, 10.8, 14.6): tr.add(c - .35, .45, whoosh, .5)
    for c in (.3, 4.9, 14.9): tr.add(c, .5, lambda t: noise() * math.exp(-t * 12), .5)   # confetti burst
    tr.add(.3, 2.0, bell((587.3, 880, 1174.7), 2.5), .6)
    tr.add(4.25, .25, lambda t: noise() * math.exp(-t * 15) * .5, .5)                    # strike-through swipe
    tr.add(4.9, 1.6, bell((880, 1318.5, 1760)), .6)                                     # 96 lands
    t = 7.5                                                                              # slot ticks, slowing down
    while t < 9.2:
        tr.add(t, .05, tick, .35); t += .05 + .12 * ((t - 7.5) / 1.7) ** 2
    tr.add(9.25, 1.8, bell((880, 1108.7, 1318.5, 1760), 3), .7)                          # 196 lands
    tr.add(11.2, .3, pop, .5); tr.add(11.8, .3, pop, .5)
    tr.add(14.9, 2.0, bell((587.3, 880, 1174.7), 2.5), .6)
    tr.add(15.3, 1.6, bell((880, 1318.5, 1760)), .45)
    return tr

def chat():
    tr = Track(22)
    beat(tr, 0, 18, 92, clap_on=False)                                                   # lo-fi bed
    Am, F, C, G = (220, 261.6, 329.6), (174.6, 220, 261.6), (261.6, 329.6, 392), (196, 246.9, 293.7)
    step = 60 / 92 * 4
    seq = [Am, F, C, G]; k = 0; t = 0
    while t < 18:
        chords(tr, [(t, min(t + step, 18.2), seq[k % 4])], .08); t += step; k += 1
    msgs = [(1.2, 0), (2.9, 0), (4.9, 1), (6.5, 0), (8.4, 1), (9.3, 1), (11.1, 0), (12.9, 1), (14.3, 0), (15.3, 0), (16.9, 1)]
    typed = {4.9, 8.4, 12.9, 16.9}
    for at, me in msgs:
        tr.add(at, .25, pop, .55 if me else .45)
        if at in typed:
            x = at - 1.2
            while x < at - .15: tr.add(x, .03, key, .25); x += .07 + .03 * noise() * .5
    tr.add(17.9, .5, whoosh, .6)
    beat(tr, 18.5, 22, 128)
    chords(tr, [(18.5, 22, (293.7, 370, 440))], .1)
    tr.add(18.5, 2.0, bell((587.3, 880, 1174.7), 2.5), .6)
    tr.add(20.1, 1.6, bell((880, 1318.5, 1760)), .5)
    return tr

if __name__ == '__main__':
    {'96': ad96, 'chat': chat}[sys.argv[1]]().save(sys.argv[2])
