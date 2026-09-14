// Icone inline dei giochi (SVG semplici, ereditano currentColor).
export default function Icona({ nome }) {
  switch (nome) {
    case 'giudice':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="4" fill="currentColor" />
          <path d="M24 4v40M4 24h40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );
    case 'rosata':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          {[[15, 30], [18, 34], [13, 26], [20, 30], [16, 22], [22, 35]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.2" fill="currentColor" />
          ))}
        </svg>
      );
    case 'tuner':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 14h32M8 24h32M8 34h32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="14" r="4" fill="currentColor" />
          <circle cx="30" cy="24" r="4" fill="currentColor" />
          <circle cx="14" cy="34" r="4" fill="currentColor" />
        </svg>
      );
    case 'piazzola':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M6 40L18 18l8 14 6-8 10 16z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M10 12h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 12l4-3M10 12l4 3M38 12l-4-3M38 12l-4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
