import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

export type Theme = 'hybrid' | 'library' | 'conservatory' | 'editorial';
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: 'hybrid', setTheme: () => {} });
const directions: { id: Theme; name: string; letter: string }[] = [
  { id: 'hybrid', name: 'Sunlit Archive', letter: '◇' },
  { id: 'library', name: 'Grand Library', letter: 'A' },
  { id: 'conservatory', name: 'Sunlit Conservatory', letter: 'B' },
  { id: 'editorial', name: 'Scholarly Editorial', letter: 'C' },
];

function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <div className="theme-bar">
    <div className="shell theme-inner">
      <span className="theme-caption"><Icon name="sun" size={17} /> A study in atmosphere</span>
      <div className="theme-options" role="group" aria-label="Compare art directions; content stays the same">
        {directions.map(direction => <button key={direction.id} type="button" aria-label={direction.name} aria-pressed={theme === direction.id} onClick={() => setTheme(direction.id)}><span className="theme-letter" aria-hidden="true">{direction.letter}</span><span>{direction.name}</span></button>)}
      </div>
    </div>
  </div>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);
  return <>
    <div className="prototype-banner">LOCAL DESIGN PROTOTYPE <span>·</span> Catalogue & PDF content are synthetic demos</div>
    <header className="site-header">
      <div className="shell header-inner">
        <Link to="/" className="brand" aria-label="ANAVELD home"><span className="brand-mark" aria-hidden="true">◇</span><span>ANAVELD<small>THE SUNLIT ARCHIVE</small></span></Link>
        <button ref={menuButton} type="button" className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        <nav id="primary-nav" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/publications">Publications</NavLink>
          <Link to="/#approach" onClick={() => setMenuOpen(false)}>The approach</Link>
          <Link to="/publications" className="header-cta">Enter the archive <Icon name="arrow" size={17} /></Link>
        </nav>
      </div>
    </header>
    <ThemeSelector />
  </>;
}

export function Layout() {
  const [theme, setTheme] = useState<Theme>('hybrid');
  const location = useLocation();
  useEffect(() => {
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  return <ThemeContext value={{ theme, setTheme }}>
    <div className="site" data-theme={theme}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <Outlet />
      <footer className="site-footer">
        <div className="shell footer-top"><Link to="/" className="brand footer-brand">◇ ANAVELD</Link><p>Physics, examined with curiosity.<br/>Ideas, kept open to revision.</p><Link className="text-link" to="/publications">Explore demo publications <Icon name="arrow" size={18}/></Link></div>
        <div className="shell footer-bottom"><span>Local prototype · No verified publication catalogue</span><span>Demo artwork & PDF · No real ANV content</span></div>
      </footer>
    </div>
  </ThemeContext>;
}
