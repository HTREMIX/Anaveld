import type { DemoPublication } from '../data/publications';

export function Cover({ publication, small = false }: { publication: DemoPublication; small?: boolean }) {
  return <div className={`cover cover-${publication.tone} ${small ? 'cover-small' : ''}`} role="img" aria-label={`Original typographic demo cover for ${publication.title}; not official ANAVELD artwork`}>
    <div className="cover-top">ANAVELD <span>DEMO {publication.number}</span></div>
    <div className={`cover-art motif-${publication.motif}`} aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="cover-title">{publication.title}</div>
    <div className="cover-bottom">A LOCAL DESIGN STUDY <span>◇</span></div>
  </div>;
}
