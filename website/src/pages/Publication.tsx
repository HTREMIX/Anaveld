import { Link, useLocation, useParams } from 'react-router-dom';
import { publications, demoPdfUrl } from '../data/publications';
import { Cover } from '../components/Cover';
import { Icon } from '../components/Icon';
import { usePageTitle } from '../usePageTitle';
import { NotFound } from './NotFound';

export default function Publication() {
  const { issueId } = useParams();
  const publication = publications.find(item => item.id === issueId);
  const location = useLocation();
  usePageTitle(publication?.title ?? 'Sample not found');
  if (!publication) return <NotFound />;
  const catalogueSearch = (location.state as { catalogueSearch?: string } | null)?.catalogueSearch ?? '';
  return <main id="main" className="shell detail-main" tabIndex={-1}>
    <Link className="back-link" to={`/publications${catalogueSearch}`}><span aria-hidden="true">←</span> Back to publications</Link>
    <div className="detail-grid">
      <div className="detail-cover"><Cover publication={publication}/><span>ORIGINAL DEMO ARTWORK · NOT AN OFFICIAL COVER</span></div>
      <div className="detail-copy">
        <div className="publication-meta"><span>DEMO {publication.number}</span><span>{publication.kind}</span></div>
        <h1 tabIndex={-1}>{publication.title}</h1>
        <p className="detail-vi" lang="vi">{publication.titleVi}</p>
        <p className="detail-summary">{publication.summary}</p>
        <div className="detail-status"><span className="demo-label">UNVERIFIED SAMPLE</span><p>This title and cover were created for this local prototype. They do not describe a verified ANAVELD publication.</p></div>
        <div className="detail-actions"><Link to={`/publications/${publication.id}/read`} state={{ catalogueSearch }} className="button button-primary"><Icon name="book"/> Read demo PDF</Link><a className="text-link" href={demoPdfUrl} target="_blank" rel="noopener noreferrer">Open demo PDF <Icon name="external" size={17}/></a></div>
        <dl className="metadata-grid"><div><dt>Subject</dt><dd>{publication.subject}</dd></div><div><dt>Publication status</dt><dd>Demo · unverified</dd></div><div><dt>Author / release / version</dt><dd>Not verified</dd></div><div><dt>Reader fixture</dt><dd>6 synthetic A4 pages</dd></div></dl>
      </div>
    </div>
    <div className="detail-notes"><section><p className="eyebrow">SCOPE & BOUNDARIES</p><h2>A starting point, with limits.</h2><p>{publication.scope}</p></section><section><p className="eyebrow">ABOUT THE READER SAMPLE</p><h2>Designed to test reading.</h2><p>All entries use the same locally generated six-page PDF about a simple oscillator. It contains selectable English text and elementary equations. It is a test fixture, not research or an actual ANV release.</p><p>No source publication, cover art, prerequisite links, or knowledge relationships have been imported.</p></section></div>
  </main>;
}
