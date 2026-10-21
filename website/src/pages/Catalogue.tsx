import { useEffect, useRef } from 'react';
import { useNavigationType, useSearchParams } from 'react-router-dom';
import { publications, normalizeText } from '../data/publications';
import { PublicationRow } from '../components/PublicationRow';
import { Icon } from '../components/Icon';
import { usePageTitle } from '../usePageTitle';

export default function Catalogue() {
  usePageTitle('Publications');
  const [params, setParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const navigationType = useNavigationType();
  const query = params.get('q') ?? '';
  const subject = params.get('subject') ?? 'All subjects';
  const sort = params.get('sort') ?? 'sequence';
  // Keep rapid native typing independent of transition-scheduled URL updates.
  // Browser history still restores the visible input to the URL query.
  useEffect(() => { if (navigationType === 'POP' && searchInput.current) searchInput.current.value = query; }, [query, navigationType]);
  function update(key: string, value: string) {
    setParams(previous => { const next = new URLSearchParams(previous); value ? next.set(key, value) : next.delete(key); return next; }, { replace: true });
  }
  const filtered = publications.filter(item => (subject === 'All subjects' || item.subject === subject) && normalizeText(`${item.id} DEMO ${item.number} ${item.title} ${item.titleVi} ${item.summary} ${item.subject} ${item.kind}`).includes(normalizeText(query.trim()))).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : a.number.localeCompare(b.number));
  return <main id="main" className="shell catalogue-main" tabIndex={-1}>
    <div className="page-heading"><p className="eyebrow">THE READING ROOM</p><h1 tabIndex={-1}>Follow your curiosity.</h1><p>Browse by question, subject, or a title that catches your eye.<br/>Each work is an entry point, not a step on a prescribed path.</p></div>
    <div className="sample-notice"><span className="demo-label">DEMO CATALOGUE</span><p>All three entries are invented, unverified interface samples. No real authors, release dates, or ANV issue IDs are claimed. Every sample opens the same synthetic reader-test PDF.</p></div>
    <div className="catalogue-tools">
      <div className="search-field"><Icon name="search"/><label className="sr-only" htmlFor="catalogue-search">Search demo catalogue</label><input ref={searchInput} id="catalogue-search" type="search" placeholder="Search titles, ideas, subjects…" defaultValue={query} onChange={event => update('q', event.target.value)} /></div>
      <div className="select-field"><label htmlFor="subject">Subject</label><select id="subject" value={subject} onChange={event => update('subject', event.target.value)}>{['All subjects', 'Mechanics', 'Fields', 'Mathematics'].map(value => <option key={value}>{value}</option>)}</select></div>
      <div className="select-field"><label htmlFor="sort">Sort by</label><select id="sort" value={sort} onChange={event => update('sort', event.target.value)}><option value="sequence">Demo sequence</option><option value="title">Title A–Z</option></select></div>
    </div>
    <div className="results-caption"><span role="status">{filtered.length} {filtered.length === 1 ? 'sample' : 'samples'}{query ? ` for “${query}”` : ''}</span><span>Publication order ≠ prerequisite order</span></div>
    {filtered.length ? <div className="publication-list">{filtered.map(item => <PublicationRow key={item.id} publication={item} />)}</div> : <div className="empty-state"><span aria-hidden="true">◇</span><h2>No samples found.</h2><p>Try “motion”, “dao động”, or choose another subject.</p><button type="button" className="button button-secondary" onClick={() => { if (searchInput.current) searchInput.current.value = ''; setParams({}); }}>Clear search & filters</button></div>}
  </main>;
}
