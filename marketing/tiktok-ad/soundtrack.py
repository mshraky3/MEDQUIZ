"""Synthesizes a 21 s soundtrack synced to ad.html's timeline (stdlib only)."""
import math, random, struct, wave

SR, DUR = 44100, 21.0
N = int(SR * DUR)
buf = [0.0] * N
random.seed(7)

def add(start, length, fn, gain=1.0):
    s = int(start * SR)
    for i in range(int(length * SR)):
        if 0 <= s + i < N:
            buf[s + i] += gain * fn(i / SR)

kick = lambda t: math.sin(2 * math.pi * (50 + 90 * math.exp(-t * 30)) * t) * math.exp(-t * 9)
hat = lambda t: (random.random() * 2 - 1) * math.exp(-t * 60)
tick = lambda t: math.sin(2 * math.pi * 1800 * t) * math.exp(-t * 70)
def whoosh(t, L=0.45):
    env = math.sin(math.pi * min(t / L, 1)) ** 2
    return (random.random() * 2 - 1) * env * 0.6
def chime(t):
    return sum(math.sin(2 * math.pi * f * t) * math.exp(-t * d) for f, d in ((880, 4), (1318.5, 5), (1760, 7))) / 3
def pad(freqs):
    return lambda t: sum(math.sin(2 * math.pi * f * t) for f in freqs) / len(freqs)

# Beat: 120 bpm, starts at 0, drops out during the countdown (tension), returns at the reveal.
beat = 0.5
for k in range(int(DUR / beat)):
    t = k * beat
    if 4.0 <= t < 8.3:
        continue
    add(t, 0.4, kick, 0.9)
    add(t + beat / 2, 0.08, hat, 0.18)

# Chord pad per scene (Am - F - C - G - Am), soft.
chords = [(0, 3, (220, 261.6, 329.6)), (3, 10.6, (174.6, 220, 261.6)), (10.6, 14.8, (261.6, 329.6, 392)),
          (14.8, 18.3, (196, 246.9, 293.7)), (18.3, 21, (220, 261.6, 329.6))]
for a, b, fr in chords:
    L = b - a
    p = pad(fr)
    add(a, L, lambda t, p=p, L=L: p(t) * min(1, t / 0.3) * min(1, (L - t) / 0.3), 0.12)

for c in (3.0, 10.6, 14.8, 18.3):
    add(c - 0.35, 0.45, whoosh, 0.5)
for s in range(5):  # timer ticks
    add(3.9 + s * 0.88, 0.06, tick, 0.35)
add(8.35, 1.6, chime, 0.6)       # correct answer
add(16.3, 1.2, chime, 0.35)      # offer end date
add(18.9, 1.6, chime, 0.45)      # CTA

peak = max(abs(x) for x in buf)
with wave.open('soundtrack.wav', 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<h', int(x / peak * 0.85 * 32767)) for x in buf))
