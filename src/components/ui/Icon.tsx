// Icônes SVG en ligne (tracés inspirés de Lucide, licence ISC) : ~0,4 Ko chacune, aucun emoji porteur de sens.
import type { ReactNode } from "react";

const P = (d: string) => <path d={d} />;

const ICONS = {
  arrowRight: [P("M5 12h14"), P("m12 5 7 7-7 7")],
  arrowLeft: [P("m12 19-7-7 7-7"), P("M19 12H5")],
  check: [P("M20 6 9 17l-5-5")],
  zap: [P("M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z")],
  rebound: [P("M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"), P("M3 3v5h5")],
  flag: [P("M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"), P("M4 22v-7")],
  lightbulb: [P("M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"), P("M9 18h6"), P("M10 22h4")],
  copy: [<rect key="r" x="8" y="8" width="14" height="14" rx="2" />, P("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],
  image: [<rect key="r" x="3" y="3" width="18" height="18" rx="2" />, <circle key="c" cx="9" cy="9" r="2" />, P("m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21")],
  printer: [P("M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"), P("M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"), <rect key="r" x="6" y="14" width="12" height="8" rx="1" />],
  share: [P("M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"), P("m16 6-4-4-4 4"), P("M12 2v13")],
  download: [P("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"), P("m7 10 5 5 5-5"), P("M12 15V3")],
  maximize: [P("M8 3H5a2 2 0 0 0-2 2v3"), P("M21 8V5a2 2 0 0 0-2-2h-3"), P("M3 16v3a2 2 0 0 0 2 2h3"), P("M16 21h3a2 2 0 0 0 2-2v-3")],
  lock: [<rect key="r" x="3" y="11" width="18" height="11" rx="2" />, P("M7 11V7a5 5 0 0 1 10 0v4")],
  info: [<circle key="c" cx="12" cy="12" r="10" />, P("M12 16v-4"), P("M12 8h.01")],
  x: [P("M18 6 6 18"), P("m6 6 12 12")],
  sun: [<circle key="c" cx="12" cy="12" r="4" />, P("M12 2v2"), P("M12 20v2"), P("m4.93 4.93 1.41 1.41"), P("m17.66 17.66 1.41 1.41"), P("M2 12h2"), P("M20 12h2"), P("m6.34 17.66-1.41 1.41"), P("m19.07 4.93-1.41 1.41")],
  moon: [P("M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z")],
  dice: [<rect key="r" x="3" y="3" width="18" height="18" rx="3" />, <circle key="a" cx="8" cy="8" r="1.2" fill="currentColor" />, <circle key="b" cx="16" cy="16" r="1.2" fill="currentColor" />, <circle key="c" cx="12" cy="12" r="1.2" fill="currentColor" />, <circle key="d" cx="16" cy="8" r="1.2" fill="currentColor" />, <circle key="e" cx="8" cy="16" r="1.2" fill="currentColor" />],
  clock: [<circle key="c" cx="12" cy="12" r="10" />, P("M12 6v6l4 2")],
  user: [P("M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"), <circle key="c" cx="12" cy="7" r="4" />],
  users: [P("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"), <circle key="c" cx="9" cy="7" r="4" />, P("M22 21v-2a4 4 0 0 0-3-3.87"), P("M16 3.13a4 4 0 0 1 0 7.75")],
  link: [P("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"), P("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71")],
  target: [<circle key="a" cx="12" cy="12" r="10" />, <circle key="b" cx="12" cy="12" r="6" />, <circle key="c" cx="12" cy="12" r="2" />],
  sparkles: [P("M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z")],
  phone: [<rect key="r" x="5" y="2" width="14" height="20" rx="2" />, P("M12 18h.01")],
  pencil: [P("M12 20h9"), P("M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z")],
  chevronDown: [P("m6 9 6 6 6-6")],
  plus: [P("M5 12h14"), P("M12 5v14")],
  trash: [P("M3 6h18"), P("M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"), P("M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2")],
  squarePlus: [<rect key="r" x="3" y="3" width="18" height="18" rx="2" />, P("M8 12h8"), P("M12 8v8")],
} satisfies Record<string, ReactNode[]>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "size-6", label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
    >
      {ICONS[name].map((el, i) => (
        <g key={i}>{el}</g>
      ))}
    </svg>
  );
}
