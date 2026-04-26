import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="wrap_sticky">
      <div className="navbar-outer w-nav">
        <div className="navbar-container">
          <Link href="/" className="link-block w-inline-block w--current">
            <h1 className="h2">PPI Repository</h1>
          </Link>
          <nav className="navbar-menu overflow-hidden w-nav-menu">
            {/* OJO: Cambiamos las etiquetas <a> por <Link> de Next.js */}
            <Link href="/" className="navbar-link w-inline-block w--current"><div>Home</div></Link>
            <Link href="/formal-bases" className="navbar-link w-inline-block"><div>Formal Bases</div></Link>
            <Link href="/indicators" className="navbar-link w-inline-block"><div>Indicators</div></Link>
            <Link href="/suggestions" className="navbar-link w-inline-block"><div>Suggestions</div></Link>
            <Link href="/contact-us" className="navbar-link w-inline-block"><div>Contact Us</div></Link>
          </nav>
        </div>
      </div>
    </div>
  );
}