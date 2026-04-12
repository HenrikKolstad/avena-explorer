export default function DnaHelix({ size = 24 }: { size?: number }) {
  const h = size;
  const w = Math.round(size * 0.6);
  return (
    <svg width={w} height={h} viewBox="0 0 20 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="dna-helix">
      <style>{`
        .dna-helix { animation: dna-spin 4s linear infinite; }
        @keyframes dna-spin {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(15deg); }
          100% { filter: hue-rotate(0deg); }
        }
        .dna-strand { animation: dna-pulse 2s ease-in-out infinite; }
        .dna-strand-2 { animation: dna-pulse 2s ease-in-out infinite 1s; }
        @keyframes dna-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
      {/* Left strand */}
      <path className="dna-strand" d="M3 2 C3 6, 17 8, 17 12 C17 16, 3 18, 3 22 C3 26, 17 28, 17 32" stroke="url(#dna-grad-1)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Right strand */}
      <path className="dna-strand-2" d="M17 2 C17 6, 3 8, 3 12 C3 16, 17 18, 17 22 C17 26, 3 28, 3 32" stroke="url(#dna-grad-2)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Rungs */}
      <line x1="6" y1="5" x2="14" y2="5" stroke="#10b981" strokeWidth="1" opacity="0.4" />
      <line x1="4" y1="9" x2="16" y2="9" stroke="#10b981" strokeWidth="1" opacity="0.5" />
      <line x1="5" y1="13" x2="15" y2="13" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
      <line x1="4" y1="17" x2="16" y2="17" stroke="#10b981" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="21" x2="14" y2="21" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
      <line x1="4" y1="25" x2="16" y2="25" stroke="#10b981" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="29" x2="14" y2="29" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
      {/* Gradients */}
      <defs>
        <linearGradient id="dna-grad-1" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="dna-grad-2" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}
