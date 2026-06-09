// Sección "Our Team / Contributors" de la vista combinada (/contact-us).
//
// Los datos viven en src/lib/contributors.ts — editá ESE archivo para
// agregar/quitar personas o fotos. Este componente solo los renderiza y se
// acomoda (centrado) para cualquier cantidad de personas.

import { contributors, type Contributor } from '@/lib/contributors';

// Iniciales para el avatar de respaldo cuando no hay foto.
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function Card({ c }: { c: Contributor }) {
  return (
    <div className="contributor-card">
      <div className="contributor-avatar">
        {c.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.photo} alt={c.name} className="contributor-photo" />
        ) : (
          <span className="contributor-initials">{initials(c.name)}</span>
        )}
      </div>
      <div className="contributor-name">
        {c.link ? (
          <a href={c.link} target="_blank" rel="noopener noreferrer">
            {c.name}
          </a>
        ) : (
          c.name
        )}
      </div>
      {c.role && <div className="contributor-role">{c.role}</div>}
      {c.email && (
        <a href={`mailto:${c.email}`} className="contributor-email">
          {c.email}
        </a>
      )}
    </div>
  );
}

export default function Contributors() {
  if (contributors.length === 0) return null;

  return (
    <section className="contributors-section">
      <div className="margin-bottom contributors-header">
        <h2 className="heading-style-h2">Our Team</h2>
        <p className="text-size-medium">The people behind the PPI Repository.</p>
      </div>

      <div className="contributors-grid">
        {contributors.map((c, i) => (
          <Card key={`${c.name}-${i}`} c={c} />
        ))}
      </div>
    </section>
  );
}
