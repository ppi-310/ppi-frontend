import NavLink from './NavLink';

export default function Navbar() {
  return (
    <div className="wrap_sticky">
      <div className="navbar-outer w-nav">
        <div className="navbar-container">
          <NavLink href="/" className="link-block w-inline-block w--current">
            <h1 className="h2">PPI Repository</h1>
          </NavLink>
          <nav className="navbar-menu overflow-hidden w-nav-menu">
            <NavLink href="/" className="navbar-link w-inline-block w--current"><div>Home</div></NavLink>
            <NavLink href="/formal-bases" className="navbar-link w-inline-block"><div>Formal Bases</div></NavLink>
            <NavLink href="/indicators" className="navbar-link w-inline-block"><div>Indicators</div></NavLink>
            <NavLink href="/contact-us" className="navbar-link w-inline-block"><div>Connect</div></NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
