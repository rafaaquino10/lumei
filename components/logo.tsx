export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Calculator Icon */}
      <rect x="2" y="6" width="28" height="28" rx="4" className="fill-primary/10"/>
      <rect x="2" y="6" width="28" height="28" rx="4" className="stroke-primary" strokeWidth="2"/>
      <rect x="7" y="11" width="6" height="4" rx="1" className="fill-primary"/>
      <rect x="15" y="11" width="6" height="4" rx="1" className="fill-primary"/>
      <rect x="23" y="11" width="2" height="4" rx="1" className="fill-primary"/>
      <line x1="7" y1="19" x2="11" y2="19" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="19" x2="19" y2="19" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="23" y1="17" x2="23" y2="21" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="21" y1="19" x2="25" y2="19" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="23" width="4" height="3" rx="1" className="fill-primary"/>
      <rect x="13" y="23" width="4" height="3" rx="1" className="fill-primary"/>
      <rect x="19" y="23" width="4" height="3" rx="1" className="fill-primary"/>
      <rect x="7" y="28" width="16" height="3" rx="1" className="fill-primary"/>

      {/* Text: Calcula */}
      <text
        x="38"
        y="24"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="700"
        className="fill-foreground"
      >
        Calcula
      </text>

      {/* Text: MEI */}
      <text
        x="108"
        y="24"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="700"
        className="fill-primary"
      >
        MEI
      </text>
    </svg>
  )
}
