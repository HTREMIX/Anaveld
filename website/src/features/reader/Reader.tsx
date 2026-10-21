import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { demoPdfUrl, normalizeText, publications } from '../../data/publications';
import { Icon } from '../../components/Icon';
import { NotFound } from '../../pages/NotFound';
import { usePageTitle } from '../../usePageTitle';
import { PdfPage } from './PdfPage';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const boundedPage = (value: number, count: number) => Math.min(Math.max(Math.trunc(value) || 1, 1), count || 1);

export default function Reader() {
  const { issueId } = useParams();
  const publication = publications.find(item => item.id === issueId);
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [availableWidth, setAvailableWidth] = useState(640);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStatus, setSearchStatus] = useState('Search the actual English text in this demo PDF.');
  const [matches, setMatches] = useState<number[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [outlineMessage, setOutlineMessage] = useState('Checking PDF outline…');
  const stage = useRef<HTMLDivElement>(null);
  const pageInput = useRef<HTMLInputElement>(null);
  const indexRef = useRef<string[] | null>(null);
  const searchGeneration = useRef(0);
  const mode = params.get('mode') === 'book' ? 'book' : 'study';
  const page = boundedPage(Number(params.get('page') ?? 1), pdf?.numPages ?? 1);
  const spread = mode === 'book' && availableWidth >= 900;
  const pageWidth = Math.max(220, Math.floor(Math.min(spread ? (availableWidth - 76) / 2 : availableWidth - 40, mode === 'book' ? 540 : 760) * zoom / 100));
  usePageTitle(publication ? `Reading: ${publication.title}` : 'Sample not found');

  useEffect(() => {
    let current = true;
    setLoadState('loading'); setPdf(null); indexRef.current = null;
    searchGeneration.current += 1;
    const loading = getDocument({ url: demoPdfUrl, isEvalSupported: false });
    void loading.promise.then(async document => {
      if (!current) return;
      setPdf(document); setLoadState('ready');
      const outline = await document.getOutline();
      if (current) setOutlineMessage(outline?.length ? 'PDF outline is present; use the native PDF viewer to explore it.' : 'This synthetic PDF has no embedded outline.');
    }).catch(() => { if (current) setLoadState('error'); });
    return () => { current = false; searchGeneration.current += 1; void loading.destroy(); };
  }, [loadAttempt]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(Math.floor(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function updateLocation(nextPage: number, nextMode = mode) {
    setParams(previous => { const next = new URLSearchParams(previous); next.set('page', String(boundedPage(nextPage, pdf?.numPages ?? 1))); next.set('mode', nextMode); return next; }, { state: location.state });
  }

  useEffect(() => {
    if (pageInput.current) pageInput.current.value = String(page);
  }, [page]);

  async function findText(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pdf) return;
    const generation = ++searchGeneration.current;
    const term = normalizeText(searchTerm.trim());
    setMatches([]); setMatchIndex(0);
    if (!term) { setSearchStatus('Enter a word or phrase to search the demo PDF.'); return; }
    setSearchStatus('Searching PDF text…');
    try {
      if (!indexRef.current) {
        const contents: string[] = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const pdfPage = await pdf.getPage(pageNumber);
          const content = await pdfPage.getTextContent();
          if (generation !== searchGeneration.current) return;
          contents.push(normalizeText(content.items.map(item => 'str' in item ? item.str : '').join(' ')));
        }
        indexRef.current = contents;
      }
      if (generation !== searchGeneration.current) return;
      const found = indexRef.current.flatMap((text, index) => text.includes(term) ? [index + 1] : []);
      setMatches(found);
      setSearchStatus(found.length ? `Found on ${found.length} ${found.length === 1 ? 'page' : 'pages'}. Showing page ${found[0]}.` : 'No matching text in the demo PDF.');
      if (found.length) updateLocation(found[0], 'study');
    } catch { if (generation === searchGeneration.current) setSearchStatus('PDF text search failed. Try again, or open the demo PDF.'); }
  }

  if (!publication) return <NotFound/>;
  const catalogueSearch = (location.state as { catalogueSearch?: string } | null)?.catalogueSearch ?? '';
  return <main id="main" className="reader-main" tabIndex={-1}>
    <div className="shell reader-heading"><Link className="back-link" to={`/publications/${publication.id}`} state={{ catalogueSearch }}><span aria-hidden="true">←</span> Publication details</Link><div className="reader-title"><div><p className="eyebrow">DEMO {publication.number} · SYNTHETIC READER FIXTURE</p><h1 tabIndex={-1}>{publication.title}</h1></div><a className="text-link" href={`${demoPdfUrl}#page=${page}`} target="_blank" rel="noopener noreferrer">Open demo PDF <Icon name="external" size={17}/></a></div></div>
    <div className="reader-workspace shell">
      <div className="reader-toolbar">
        <div className="mode-switch" role="group" aria-label="Reading mode"><button type="button" aria-pressed={mode === 'study'} onClick={() => updateLocation(page, 'study')}>Study <span>PDF + text</span></button><button type="button" aria-pressed={mode === 'book'} onClick={() => { setZoom(100); updateLocation(page, 'book'); }}>Book <span>Experimental layout</span></button></div>
        <div className="zoom-control"><label htmlFor="zoom">Zoom</label><select id="zoom" value={zoom} onChange={event => setZoom(Number(event.target.value))}>{[75, 100, 125, 150, 200].map(value => <option key={value} value={value}>{value}%</option>)}</select></div>
      </div>
      <div className="reader-mode-note">{mode === 'book' ? <><strong>Experimental Book presentation.</strong> {spread ? 'Two-page layout' : 'Single page at this width'}; page curl is unavailable. Use Study for text selection and search. <button type="button" disabled>Animated page curl · unavailable</button></> : <><strong>Study view.</strong> PDF.js renders the original demo pages with a selectable text layer. For browser-native PDF tools, open the demo PDF above. Formula copying and PDF accessibility are not verified.</>}</div>
      <form className="pdf-search" onSubmit={event => { void findText(event); }}><label htmlFor="pdf-search">Find in demo PDF</label><div className="pdf-search-input"><input id="pdf-search" type="search" value={searchTerm} placeholder="Try “equilibrium”" onChange={event => setSearchTerm(event.target.value)} disabled={!pdf}/><button type="submit" className="button button-secondary" disabled={!pdf}>Find</button>{matches.length > 1 && <button type="button" className="button button-secondary" onClick={() => { const nextIndex = (matchIndex + 1) % matches.length; setMatchIndex(nextIndex); updateLocation(matches[nextIndex], 'study'); setSearchStatus(`Match page ${nextIndex + 1} of ${matches.length}. Showing page ${matches[nextIndex]}.`); }}>Next result</button>}</div><p role="status">{searchStatus}</p></form>
      <div ref={stage} className={`reader-stage ${mode === 'book' ? 'book-stage' : 'study-stage'}`} data-mode={mode} tabIndex={0} aria-label="PDF page area; left and right arrows change pages when focused" onKeyDown={event => {
        if (event.target !== event.currentTarget || !pdf) return;
        if (event.key === 'ArrowRight') { event.preventDefault(); updateLocation(page + 1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); updateLocation(page - 1); }
      }}>
        {loadState === 'loading' && <div className="loading-state" role="status">Loading the local demo PDF…</div>}
        {loadState === 'error' && <div className="reader-error" role="alert"><h2>The demo PDF could not open.</h2><p>Retry loading, or use the direct PDF link.</p><button type="button" className="button button-primary" onClick={() => setLoadAttempt(value => value + 1)}>Retry PDF</button><a className="text-link" href={demoPdfUrl}>Open demo PDF directly</a></div>}
        {pdf && <div className={`pdf-pages ${spread ? 'is-spread' : ''}`}><PdfPage document={pdf} pageNumber={page} width={pageWidth} selectable={mode === 'study'}/>{spread && page < pdf.numPages && <PdfPage document={pdf} pageNumber={page + 1} width={pageWidth} selectable={false}/>}</div>}
      </div>
      <div className="page-navigation"><button type="button" className="button button-secondary" disabled={!pdf || page <= 1} onClick={() => updateLocation(page - 1)}><span aria-hidden="true">←</span> Previous</button><form onSubmit={event => { event.preventDefault(); if (pageInput.current) { const next = boundedPage(Number(pageInput.current.value), pdf?.numPages ?? 1); pageInput.current.value = String(next); updateLocation(next); } }}><label htmlFor="page-number">Page</label><input ref={pageInput} id="page-number" aria-label="PDF page number" type="number" min={1} max={pdf?.numPages ?? 1} defaultValue={page} disabled={!pdf}/><span>of {pdf?.numPages ?? '…'}</span><button type="submit" disabled={!pdf}>Go</button></form><button type="button" className="button button-secondary" disabled={!pdf || page >= pdf.numPages} onClick={() => updateLocation(page + 1)}>Next <span aria-hidden="true">→</span></button></div>
      <p className="page-announcement" aria-live="polite" aria-atomic="true">{pdf ? `PDF page ${page} of ${pdf.numPages}${spread && page < pdf.numPages ? `; page ${page + 1} also visible` : ''}. ${mode === 'study' ? 'Study' : 'Book'} view.` : ''}</p>
    </div>
    <div className="shell reader-notes"><p>{outlineMessage} Only visible pages are rasterized. No page-turn gesture captures your scroll.</p><details><summary>Read the demo as HTML · content & limitations</summary><p>This is an original six-page test document, not an ANAVELD publication. Page 1 introduces the sample; page 2 defines equilibrium and the linear force F = −kx; page 3 gives x(t) = A cos(ωt + φ), where ω² = k/m; page 4 discusses energy; page 5 states limitations; page 6 provides reading checks. The undamped, one-dimensional oscillator is a teaching example only.</p><p>Book mode is a static experimental layout without animated page curl. Study supports basic PDF text selection, page-level phrase search and zoom for this fixture. This is not a full PDF.js viewer: annotations, editing, user bookmarks and an outline panel are unavailable. Use browser-native PDF tools where supported. The PDF is not tagged for accessibility; screen-reader reading order, formula copy and real ANV PDFs have not been verified.</p><p lang="vi">Mẫu chữ tiếng Việt: Ổn định trên paraboloid đang quay. Điện tích trên vòng quay trong trường lưỡng cực điện. Ắ Ằ Ẵ Ặ ấ ẩ ẫ ậ ơ ư ỵ.</p></details></div>
  </main>;
}
