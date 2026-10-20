import type { ReactNode } from 'react';

const INK = '#1F1A17';
const s = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export type ArtKind =
  | 'sausage' | 'ham' | 'cheese' | 'milk' | 'bread' | 'dumplings' | 'pickles' | 'jar'
  | 'bottle' | 'sweets' | 'gingerbread' | 'sack' | 'soup' | 'cake' | 'fish' | 'kabanos';

function Frame({ children, bg }: { children: ReactNode; bg: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill={bg} />
      {children}
    </svg>
  );
}

/** Flat sticker-style product illustrations, drawn in code so the demo carries no borrowed photography. */
export function ProductArt({ kind, bg = '#FDF1E1', tint }: { kind: ArtKind; bg?: string; tint?: string }) {
  switch (kind) {
    case 'sausage':
      return (
        <Frame bg={bg}>
          <path d="M22 70c8-26 52-40 76-22 6 5 2 12-5 10-20-8-46 0-58 18-4 6-15 2-13-6z" fill={tint ?? '#B5452F'} {...s} />
          <path d="M40 58l4 6M56 50l3 6M72 46l2 6" {...s} />
          <path d="M94 50c6-4 10-2 12 2" fill="none" {...s} />
        </Frame>
      );
    case 'kabanos':
      return (
        <Frame bg={bg}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={34 + i * 16} y={24} width="11" height="74" rx="5.5" fill={tint ?? '#8E3B26'} {...s} transform={`rotate(${-12 + i * 12} 60 60)`} />
          ))}
          <path d="M36 24c8-8 40-8 48 0" fill="none" {...s} />
        </Frame>
      );
    case 'ham':
      return (
        <Frame bg={bg}>
          <ellipse cx="60" cy="66" rx="36" ry="26" fill={tint ?? '#F0A1A0'} {...s} />
          <ellipse cx="60" cy="62" rx="24" ry="15" fill="#F7C6C2" {...s} />
          <path d="M44 60c6-4 22-4 30 2" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </Frame>
      );
    case 'cheese':
      return (
        <Frame bg={bg}>
          <path d="M22 76l58-36 20 22v18H22z" fill={tint ?? '#FFF6D8'} {...s} />
          <path d="M22 76h78" {...s} />
          <circle cx="58" cy="70" r="5" fill={bg} {...s} />
          <circle cx="80" cy="62" r="4" fill={bg} {...s} />
        </Frame>
      );
    case 'milk':
      return (
        <Frame bg={bg}>
          <path d="M42 34h36l6 12v52H36V46z" fill="#fff" {...s} />
          <path d="M42 34l-6 12h48" fill="none" {...s} />
          <rect x="44" y="24" width="32" height="10" rx="3" fill={tint ?? '#2C5AA0'} {...s} />
          <path d="M36 70c10-6 38-6 48 0v28H36z" fill={tint ?? '#2C5AA0'} {...s} />
        </Frame>
      );
    case 'bread':
      return (
        <Frame bg={bg}>
          <path d="M20 74c0-22 18-36 40-36s40 14 40 36c0 8-6 12-14 12H34c-8 0-14-4-14-12z" fill={tint ?? '#C98A3E'} {...s} />
          <path d="M40 54l8 10M56 48l8 12M72 50l8 10" fill="none" {...s} />
        </Frame>
      );
    case 'dumplings':
      return (
        <Frame bg={bg}>
          {[
            [40, 66, -8],
            [76, 62, 10],
            [58, 82, 0],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <path d={`M${x - 20} ${y + 4}c0-18 40-18 40 0z`} fill={tint ?? '#FFF1D6'} {...s} />
              <path d={`M${x - 14} ${y - 4}l3 4M${x - 6} ${y - 9}l2 5M${x + 2} ${y - 10}v5M${x + 10} ${y - 8}l-2 5M${x + 16} ${y - 3}l-3 4`} {...s} />
            </g>
          ))}
        </Frame>
      );
    case 'pickles':
      return (
        <Frame bg={bg}>
          <rect x="34" y="34" width="52" height="64" rx="10" fill="#E8F3E4" {...s} />
          <rect x="38" y="24" width="44" height="12" rx="3" fill={tint ?? '#D6232A'} {...s} />
          <rect x="44" y="44" width="10" height="44" rx="5" fill="#3E8A4F" {...s} />
          <rect x="58" y="48" width="10" height="40" rx="5" fill="#2E7D4F" {...s} />
          <path d="M74 50c4 8 4 30 0 38" fill="none" {...s} />
        </Frame>
      );
    case 'jar':
      return (
        <Frame bg={bg}>
          <rect x="34" y="38" width="52" height="58" rx="12" fill={tint ?? '#8E1B2E'} {...s} />
          <rect x="38" y="26" width="44" height="14" rx="3" fill="#F2B33D" {...s} />
          <rect x="42" y="56" width="36" height="22" rx="4" fill="#FFF8EE" {...s} />
          <path d="M50 67h20" {...s} />
        </Frame>
      );
    case 'bottle':
      return (
        <Frame bg={bg}>
          <path d="M52 20h16v18l8 12v48a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6V50l8-12z" fill={tint ?? '#7A3E1B'} {...s} />
          <rect x="50" y="14" width="20" height="8" rx="2" fill="#F2B33D" {...s} />
          <rect x="46" y="62" width="28" height="20" rx="3" fill="#FFF8EE" {...s} />
        </Frame>
      );
    case 'sweets':
      return (
        <Frame bg={bg}>
          {[
            [36, 50, '#D6232A'],
            [70, 44, '#2C5AA0'],
            [52, 76, '#F2B33D'],
            [84, 74, '#2E7D4F'],
          ].map(([x, y, c], i) => (
            <g key={i}>
              <path d={`M${Number(x) - 18} ${y}l-8-7v14zM${Number(x) + 18} ${y}l8-7v14z`} fill={String(c)} {...s} />
              <rect x={Number(x) - 18} y={Number(y) - 9} width="36" height="18" rx="9" fill={String(c)} {...s} />
            </g>
          ))}
        </Frame>
      );
    case 'gingerbread':
      return (
        <Frame bg={bg}>
          <path d="M60 22c18 0 32 12 32 30 0 22-14 44-32 44S28 74 28 52c0-18 14-30 32-30z" fill={tint ?? '#9A5A2C'} {...s} />
          <path d="M40 50c6 4 34 4 40 0M44 66c6 4 26 4 32 0M50 80c4 2 16 2 20 0" fill="none" stroke="#FFF8EE" strokeWidth="3.5" strokeLinecap="round" />
        </Frame>
      );
    case 'sack':
      return (
        <Frame bg={bg}>
          <path d="M40 40c-10 14-14 32-10 46 2 8 10 12 30 12s28-4 30-12c4-14 0-32-10-46z" fill={tint ?? '#E7CFA0'} {...s} />
          <path d="M40 40c4-8 36-8 40 0" fill="none" {...s} />
          <path d="M44 34c6-6 26-6 32 0" fill="none" {...s} />
          <rect x="44" y="60" width="32" height="18" rx="3" fill="#FFF8EE" {...s} />
        </Frame>
      );
    case 'soup':
      return (
        <Frame bg={bg}>
          <path d="M22 58h76c0 22-16 36-38 36S22 80 22 58z" fill="#FFF8EE" {...s} />
          <ellipse cx="60" cy="58" rx="38" ry="9" fill={tint ?? '#B3122E'} {...s} />
          <path d="M48 40c-4-6 4-8 0-14M62 38c-4-6 4-8 0-14M76 40c-4-6 4-8 0-14" fill="none" {...s} />
        </Frame>
      );
    case 'cake':
      return (
        <Frame bg={bg}>
          <path d="M26 58l68-20v40l-68 18z" fill={tint ?? '#F5DDB0'} {...s} />
          <path d="M26 58l68-20 4 6-68 20z" fill="#FFF8EE" {...s} />
          <path d="M28 74l68-18" stroke="#B3122E" strokeWidth="5" />
          <circle cx="78" cy="38" r="5" fill="#D6232A" {...s} />
        </Frame>
      );
    case 'fish':
      return (
        <Frame bg={bg}>
          <path d="M24 60c14-18 46-20 62-4l12-10v28l-12-10c-16 16-48 14-62-4z" fill={tint ?? '#C9A24A'} {...s} />
          <circle cx="40" cy="58" r="3" fill={INK} />
          <path d="M56 50c4 6 4 14 0 20M68 50c4 6 4 14 0 20" fill="none" {...s} />
        </Frame>
      );
  }
}

/** Wycinanki-style cut-paper medallion, the brand's folk pattern. */
export function Wycinanka({ className = '', colour = '#D6232A', accent = '#F2B33D', leaf = '#2E7D4F' }: { className?: string; colour?: string; accent?: string; leaf?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  const leaves = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill={colour} />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#FFF8EE" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      {leaves.map((a) => (
        <path key={`l${a}`} d="M100 30c10 12 10 24 0 36-10-12-10-24 0-36z" fill={leaf} transform={`rotate(${a} 100 100)`} />
      ))}
      {petals.map((a) => (
        <path key={`p${a}`} d="M100 18c14 14 14 30 0 46-14-16-14-32 0-46z" fill="#FFF8EE" transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="34" fill={accent} />
      {petals.map((a) => (
        <circle key={`d${a}`} cx="100" cy="74" r="4" fill={colour} transform={`rotate(${a} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="16" fill={colour} />
      <circle cx="100" cy="100" r="6" fill="#FFF8EE" />
    </svg>
  );
}

export function FolkFlower({ className = '', colour = '#D6232A' }: { className?: string; colour?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d="M20 4c5 5 5 10 0 15-5-5-5-10 0-15z" fill={colour} transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="5" fill="#F2B33D" />
    </svg>
  );
}

/** The Nasz Sklep sign, redrawn: red outlined plaque with a folk flower. */
export function Logo({ className = '', invert = false }: { className?: string; invert?: boolean }) {
  const red = invert ? '#FFF8EE' : '#D6232A';
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="font-display font-extrabold leading-none tracking-tight whitespace-nowrap rounded-[0.6em] border-[0.14em] px-[0.5em] pt-[0.18em] pb-[0.24em] inline-flex items-center gap-[0.3em]"
        style={{ color: red, borderColor: red }}
      >
        <FolkFlower className="w-[0.85em] h-[0.85em]" colour={red} />
        Nasz Sklep
      </span>
    </span>
  );
}
