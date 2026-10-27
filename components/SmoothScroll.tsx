'use client';

import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export default function SmoothScroll() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return <ReactLenis root options={{
    autoRaf: true,
    autoToggle: true,
    duration: 1.1,
    anchors: true,
    stopInertiaOnNavigate: true,
  }} />;
}
