import { useLayoutEffect } from 'react';

export function usePageTitle(title: string) {
  useLayoutEffect(() => {
    document.title = `${title} · ANAVELD local prototype`;
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [title]);
}
