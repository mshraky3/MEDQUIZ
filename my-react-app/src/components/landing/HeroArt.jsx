import React from 'react';

/**
 * Decorative medical-tech composition for the hero — geometric molecules,
 * concentric rings, a DNA strand and an animated ECG/heartbeat line. Purely
 * decorative (aria-hidden); colours use the landing accent palette at low
 * opacity so the headline always stays the focus.
 */
const HeroArt = () => (
    <div className="hero-art" aria-hidden="true">
        <svg className="hero-art-svg" viewBox="0 0 1200 760" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ha-blue" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="ha-cyan" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#0ea5e9" />
                    <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
            </defs>

            {/* molecule — hexagon ring of nodes, top-left */}
            <g className="ha-float" stroke="url(#ha-blue)" strokeWidth="2" opacity="0.55">
                <polygon points="225,180 197,228 143,228 115,180 143,132 197,132" fill="none" />
                <line x1="170" y1="180" x2="225" y2="180" />
                <line x1="170" y1="180" x2="143" y2="132" />
                <line x1="170" y1="180" x2="143" y2="228" />
                <g fill="#fff" stroke="url(#ha-blue)">
                    <circle cx="225" cy="180" r="7" /><circle cx="197" cy="228" r="7" />
                    <circle cx="143" cy="228" r="7" /><circle cx="115" cy="180" r="7" />
                    <circle cx="143" cy="132" r="7" /><circle cx="197" cy="132" r="7" />
                </g>
                <circle cx="170" cy="180" r="9" fill="url(#ha-blue)" stroke="none" />
            </g>

            {/* concentric rings + crosshair, top-right */}
            <g className="ha-spin" stroke="#7c3aed" strokeWidth="2" opacity="0.45">
                <circle cx="1035" cy="165" r="72" />
                <circle cx="1035" cy="165" r="48" strokeDasharray="6 8" />
                <circle cx="1035" cy="165" r="24" />
                <circle cx="1035" cy="165" r="5" fill="#7c3aed" stroke="none" />
            </g>

            {/* DNA double helix, mid-right */}
            <g className="ha-float-slow" stroke="url(#ha-cyan)" strokeWidth="2.5" opacity="0.5">
                <path d="M1070 360 C1150 410 1150 470 1070 520 C990 570 990 630 1070 680" fill="none" />
                <path d="M1130 360 C1050 410 1050 470 1130 520 C1210 570 1210 630 1130 680" fill="none" />
                <line x1="1082" y1="392" x2="1118" y2="392" />
                <line x1="1064" y1="440" x2="1136" y2="440" />
                <line x1="1082" y1="520" x2="1118" y2="520" />
                <line x1="1064" y1="600" x2="1136" y2="600" />
                <line x1="1082" y1="648" x2="1118" y2="648" />
            </g>

            {/* medical crosses + particles */}
            <g opacity="0.4">
                <path className="ha-float" d="M372 132h16v16h16v16h-16v16h-16v-16h-16v-16h16z" fill="#16a34a" />
                <path className="ha-float-slow" d="M150 540h12v12h12v12h-12v12h-12v-12h-12v-12h12z" fill="#0ea5e9" />
                <path className="ha-float" d="M880 560h12v12h12v12h-12v12h-12v-12h-12v-12h12z" fill="#6366f1" />
            </g>
            <g fill="#3b82f6" opacity="0.35" className="ha-float-slow">
                <circle cx="430" cy="250" r="5" /><circle cx="980" cy="300" r="4" />
                <circle cx="300" cy="660" r="5" /><circle cx="700" cy="120" r="4" />
                <circle cx="560" cy="560" r="4" />
            </g>

            {/* ECG / heartbeat line along the lower band */}
            <path className="ha-ecg"
                d="M0 700 H250 l22 -8 l16 -66 l22 142 l18 -112 l16 44 H540 l22 -10 l16 -58 l20 116 l18 -86 l14 38 H840 l24 -8 l16 -70 l22 150 l18 -120 l16 48 H1200"
                stroke="url(#ha-cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </svg>
    </div>
);

export default HeroArt;
