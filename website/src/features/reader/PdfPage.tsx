import { useEffect, useRef, useState } from 'react';
import { TextLayer, type PDFDocumentProxy } from 'pdfjs-dist';
import './pdf-text-layer.css';

export function PdfPage({ document, pageNumber, width, selectable }: { document: PDFDocumentProxy; pageNumber: number; width: number; selectable: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [height, setHeight] = useState(width * 297 / 210);
  useEffect(() => {
    let cancelled = false;
    let renderTask: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined;
    let layer: TextLayer | undefined;
    const textContainer = text.current;
    setState('loading');
    textContainer?.replaceChildren();
    async function render() {
      try {
        const page = await document.getPage(pageNumber);
        if (cancelled || !canvas.current || !textContainer) return;
        const unitViewport = page.getViewport({ scale: 1 });
        const scale = width / unitViewport.width;
        const viewport = page.getViewport({ scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const surface = canvas.current;
        surface.width = Math.ceil(viewport.width * dpr);
        surface.height = Math.ceil(viewport.height * dpr);
        setHeight(viewport.height);
        renderTask = page.render({ canvas: surface, viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined });
        await renderTask.promise;
        if (cancelled) return;
        if (selectable) {
          const content = await page.getTextContent();
          if (cancelled) return;
          textContainer.style.setProperty('--scale-factor', String(scale));
          textContainer.style.setProperty('--total-scale-factor', String(scale));
          layer = new TextLayer({ textContentSource: content, container: textContainer, viewport });
          await layer.render();
        }
        if (!cancelled) setState('ready');
      } catch (error) {
        if (!cancelled && !(error instanceof Error && /cancel/i.test(error.name))) setState('error');
      }
    }
    void render();
    return () => { cancelled = true; renderTask?.cancel(); layer?.cancel(); textContainer?.replaceChildren(); };
  }, [document, pageNumber, width, selectable, retry]);
  return <div className="pdf-page" data-page={pageNumber} data-render-state={state} style={{ width, height }}>
    <canvas ref={canvas} style={{ width, height }} role="img" aria-label={`Synthetic PDF page ${pageNumber}. Use the text layer, HTML transcript below, or open the demo PDF.`}/>
    <div ref={text} className="textLayer" aria-hidden={!selectable} />
    {state === 'loading' && <span className="pdf-page-status" role="status">Rendering page {pageNumber}…</span>}
    {state === 'error' && <div className="pdf-page-status" role="alert"><p>This page could not render.</p><button type="button" className="button button-secondary" onClick={() => setRetry(value => value + 1)}>Retry page</button></div>}
  </div>;
}
