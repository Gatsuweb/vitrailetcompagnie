'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SectionMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = document.querySelectorAll<HTMLElement>('main section:not(#accueil), main > div > header');
    const targets = Array.from(sections).flatMap(section =>
      Array.from(section.children).filter((child): child is HTMLElement =>
        child instanceof HTMLElement && !child.classList.contains('reveal-on-scroll')
      )
    );

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.sectionVisible = 'true';
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.05 });

    for (const target of targets) {
      target.dataset.sectionReveal = 'true';
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
      for (const target of targets) {
        delete target.dataset.sectionReveal;
        delete target.dataset.sectionVisible;
      }
    };
  }, [pathname]);

  return null;
}


