import Link from 'next/link';

export type DimensionKey = 'general' | 'time' | 'cost' | 'quality' | 'flexibility';

type Props = {
  current: DimensionKey;
};

const DIMS: { key: DimensionKey; label: string; href: string }[] = [
  { key: 'general', label: 'General', href: '/indicators' },
  { key: 'time', label: 'Time', href: '/indicators/time' },
  { key: 'cost', label: 'Cost', href: '/indicators/cost' },
  { key: 'quality', label: 'Quality', href: '/indicators/quality' },
  { key: 'flexibility', label: 'Flexibility', href: '/indicators/flexibility' },
];

export default function DimensionsNavbar({ current }: Props) {
  return (
    <div className="navbar-outer dimensions w-nav">
      <div className="navbar-container navbar-ppi">
        <nav role="navigation" className="navbar-menu overflow-hidden navbar-ppi w-nav-menu">
          {DIMS.map((d) => {
            const isCurrent = d.key === current;
            return (
              <Link
                key={d.key}
                href={d.href}
                {...(isCurrent ? { 'aria-current': 'page' as const } : {})}
                className={
                  isCurrent
                    ? 'navbar-link w-nav-link w--current'
                    : 'navbar-link w-nav-link'
                }
              >
                {d.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
