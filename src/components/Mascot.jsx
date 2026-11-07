/**
 * Doorie: Front Door's little house mascot, in Habitat for Humanity's palette
 * (bright blue roof, bright green door, orange cheeks, yellow sparkles).
 * mood: 'wave' (hello), 'cheer' (plan ready), 'think' (nothing yet).
 * Decorative by default; pass `label` to make it an announced image.
 */
export default function Mascot({ mood = 'wave', size = 140, label, className = '' }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} className={`mascot mascot-${mood} ${className}`} {...a11y}>
      {/* soft shadow */}
      <ellipse cx="80" cy="150" rx="44" ry="6" fill="#002f6c" opacity=".12" className="mascot-shadow" />
      <g className="mascot-body">
        {/* house body */}
        <rect x="34" y="66" width="92" height="78" rx="22" fill="#ffffff" stroke="#002f6c" strokeWidth="4" />
        {/* roof */}
        <path d="M22 74 80 26l58 48" fill="#0099cc" stroke="#002f6c" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M22 74 80 26l58 48Z" fill="#0099cc" />
        {/* chimney */}
        <rect x="104" y="36" width="12" height="20" rx="3" fill="#0099cc" stroke="#002f6c" strokeWidth="4" />
        {/* door */}
        <path d="M68 144v-26a12 12 0 0 1 24 0v26Z" fill="#c4d600" stroke="#002f6c" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="86" cy="130" r="2.6" fill="#002f6c" />
        {/* face */}
        {mood === 'think' ? (
          <>
            <path d="M58 84q6 -4 12 0" fill="none" stroke="#002f6c" strokeWidth="4" strokeLinecap="round" />
            <path d="M90 84q6 -4 12 0" fill="none" stroke="#002f6c" strokeWidth="4" strokeLinecap="round" />
            <path d="M72 96h16" stroke="#002f6c" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <g className="mascot-eyes">
              <ellipse cx="64" cy="84" rx="5" ry="6" fill="#002f6c" />
              <ellipse cx="96" cy="84" rx="5" ry="6" fill="#002f6c" />
              <circle cx="66" cy="82" r="1.8" fill="#fff" />
              <circle cx="98" cy="82" r="1.8" fill="#fff" />
            </g>
            <path d={mood === 'cheer' ? 'M68 92q12 13 24 0Z' : 'M70 93q10 8 20 0'} fill={mood === 'cheer' ? '#e55d25' : 'none'} stroke="#002f6c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {/* cheeks */}
        <ellipse cx="52" cy="95" rx="7" ry="4.5" fill="#e55d25" opacity=".45" />
        <ellipse cx="108" cy="95" rx="7" ry="4.5" fill="#e55d25" opacity=".45" />
        {/* arms */}
        {mood === 'wave' && (
          <path className="mascot-arm" d="M126 100q16 -6 18 -24" fill="none" stroke="#002f6c" strokeWidth="5" strokeLinecap="round" />
        )}
        {mood === 'cheer' && (
          <>
            <path className="mascot-arm" d="M126 98q14 -10 14 -30" fill="none" stroke="#002f6c" strokeWidth="5" strokeLinecap="round" />
            <path className="mascot-arm mascot-arm-left" d="M34 98q-14 -10 -14 -30" fill="none" stroke="#002f6c" strokeWidth="5" strokeLinecap="round" />
          </>
        )}
        {mood === 'think' && (
          <path d="M34 110q-12 -2 -10 -16" fill="none" stroke="#002f6c" strokeWidth="5" strokeLinecap="round" />
        )}
      </g>
      {/* sparkles */}
      {mood !== 'think' ? (
        <g className="mascot-sparkles" fill="#ffd100" stroke="#002f6c" strokeWidth="2" strokeLinejoin="round">
          <path d="M18 34l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
          <path d="M144 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
          {mood === 'cheer' && <path d="M140 120l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5Z" />}
        </g>
      ) : (
        <g fill="#0099cc" opacity=".8">
          <circle cx="16" cy="66" r="4" /><circle cx="10" cy="50" r="6" /><text x="2" y="38" fontSize="22" fontWeight="800" fill="#002f6c">?</text>
        </g>
      )}
    </svg>
  );
}
