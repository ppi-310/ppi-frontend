import Link from 'next/link';

// Tag con apariencia de botón.
//   - Con `href`: clickeable, navega a /indicators/... con el filtro activo.
//   - Sin `href`: estático (no clickeable) — se usa en las tarjetas del grid.
type Props = {
  name: string;
  href?: string;
};

export default function TagButton({ name, href }: Props) {
  if (href) {
    return (
      <Link href={href} className="tag-button" title={`Filter by "${name}"`}>
        {name}
      </Link>
    );
  }
  return <span className="tag-button tag-button--static">{name}</span>;
}
