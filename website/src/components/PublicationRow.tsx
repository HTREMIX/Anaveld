import { Link, useLocation } from 'react-router-dom';
import type { DemoPublication } from '../data/publications';
import { Cover } from './Cover';
import { Icon } from './Icon';

export function PublicationRow({ publication }: { publication: DemoPublication }) {
  const location = useLocation();
  return <article className="publication-row">
    <div className="publication-cover-wrap"><Cover publication={publication} small /></div>
    <div className="publication-copy">
      <div className="publication-meta"><span>DEMO {publication.number}</span><span>{publication.kind}</span><span className="demo-label">UNVERIFIED SAMPLE</span></div>
      <h3><Link to={`/publications/${publication.id}`} state={{ catalogueSearch: location.pathname === '/publications' ? location.search : '' }}>{publication.title}</Link></h3>
      <p className="publication-vi" lang="vi">{publication.titleVi}</p>
      <p>{publication.summary}</p>
    </div>
    <span className="publication-subject">{publication.subject}</span>
    <Link to={`/publications/${publication.id}`} state={{ catalogueSearch: location.pathname === '/publications' ? location.search : '' }} className="row-arrow" aria-label={`View ${publication.title}`}><Icon name="arrow" /></Link>
  </article>;
}
