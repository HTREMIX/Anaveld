import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Publication from './pages/Publication';
import { NotFound } from './pages/NotFound';
import '@fontsource/lora/latin-400.css';
import '@fontsource/lora/latin-400-italic.css';
import '@fontsource/lora/vietnamese-400.css';
import '@fontsource/lora/vietnamese-400-italic.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/latin-500.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import './styles/global.css';

const Reader = lazy(() => import('./features/reader/Reader'));

createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="publications" element={<Catalogue/>}/><Route path="publications/:issueId" element={<Publication/>}/><Route path="publications/:issueId/read" element={<Suspense fallback={<main id="main" className="shell loading-state" role="status">Opening the reading room…</main>}><Reader/></Suspense>}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter></React.StrictMode>);
