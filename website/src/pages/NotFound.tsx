import { Link } from 'react-router-dom';

export function NotFound() {
  return <main id="main" className="shell empty-state" tabIndex={-1}><p className="eyebrow">A PATH STILL UNWRITTEN</p><h1 tabIndex={-1}>This page is not in the archive.</h1><p>There are three clearly labeled samples to explore.</p><Link className="button button-primary" to="/publications">Return to publications</Link></main>;
}
