type Name = 'arrow' | 'search' | 'book' | 'close' | 'menu' | 'external' | 'chevron' | 'sun';

export function Icon({ name, size = 20 }: { name: Name; size?: number }) {
  const paths: Record<Name, React.ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    book: <><path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1ZM12 5v15" /></>,
    close: <path d="m5 5 14 14M5 19 19 5" />,
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    external: <><path d="M14 3h7v7M21 3 10 14M10 4H4v16h16v-6" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
