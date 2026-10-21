import { Link } from 'react-router-dom';
import { ArchiveIllustration } from '../components/ArchiveIllustration';
import { PublicationRow } from '../components/PublicationRow';
import { Icon } from '../components/Icon';
import { publications } from '../data/publications';
import { usePageTitle } from '../usePageTitle';

export default function Home() {
  usePageTitle('The Sunlit Archive');
  return <main id="main" tabIndex={-1}>
    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow"><span className="little-rule" /> PHYSICS · MODELS · IDEAS</p>
        <h1 tabIndex={-1}>A place for<br/>curiosity to<br/><em>take root.</em></h1>
        <p className="hero-intro">Independent explorations in physics.<br className="desktop-break"/> A closer look at the questions, models, and<br className="desktop-break"/> ideas that help us understand.</p>
        <div className="hero-actions"><Link to="/publications" className="button button-primary">Explore publications <Icon name="arrow" /></Link><a href="#approach" className="text-link">Our approach <span aria-hidden="true">↘</span></a></div>
        <div className="hero-note"><span aria-hidden="true">◇</span><p>An archive of inquiry.<br/><span>Always open to a better question.</span></p></div>
      </div>
      <ArchiveIllustration />
    </section>
    <div className="archive-ribbon"><div className="shell"><span>READ CLOSELY</span><i aria-hidden="true">◇</i><span>QUESTION THE MODEL</span><i aria-hidden="true">◇</i><span>KEEP EXPLORING</span></div></div>
    <section className="shell publication-section" aria-labelledby="publications-heading">
      <div className="section-heading"><div><p className="eyebrow">FROM THE READING TABLE</p><h2 id="publications-heading">Paths into an idea.</h2></div><Link className="text-link" to="/publications">Browse all samples <Icon name="arrow" size={19} /></Link></div>
      <p className="section-intro">Three illustrative entries for exploring the interface. These are synthetic samples, not verified ANAVELD releases.</p>
      <div className="publication-list">{publications.map(publication => <PublicationRow key={publication.id} publication={publication} />)}</div>
    </section>
    <section id="approach" className="approach-section" aria-labelledby="approach-heading">
      <div className="shell approach-grid">
        <div><p className="eyebrow">THE SPIRIT OF THE ARCHIVE</p><h2 id="approach-heading">Knowledge is a practice,<br/><em>not a destination.</em></h2><p>Start with a question. Make the assumptions visible. Follow the reasoning, and leave room to return with a different perspective.</p></div>
        <div className="approach-principles">
          <div><span>01</span><h3>A model to examine</h3><p>A way of describing a physical system, with assumptions and limits worth understanding.</p></div>
          <div><span>02</span><h3>A question to explore</h3><p>A particular problem within that model. A useful answer begins with a well-framed question.</p></div>
          <div><span>03</span><h3>An idea to revisit</h3><p>A publication has its own scope. Its issue number expresses release order, never a learning hierarchy.</p></div>
        </div>
      </div>
    </section>
  </main>;
}
