'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'revealing' | 'complete';

export function useHeroIntro() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [moonRequested, setMoonRequested] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const complete = phase === 'complete';
  const finish = useCallback(() => setPhase('complete'), []);

  const enter = () => {
    setMoonRequested(true);
    if (phase === 'revealing' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
    } else {
      setPhase('revealing');
    }
  };

  useEffect(() => {
    if (complete) {
      titleRef.current?.focus({ preventScroll: true });
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    const previous = { root: root.style.overflow, body: body.style.overflow };
    const hero = buttonRef.current?.closest('section');
    const siblings = Array.from(hero?.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== hero);
    const previousInert = siblings.map(element => element.inert);

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    siblings.forEach(element => { element.inert = true; });
    window.scrollTo({ top: 0, behavior: 'instant' });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); finish(); }
      // Move focus to the sole action only when the visitor starts keyboard
      // navigation. This avoids showing a selected state on pointer devices.
      if (event.key === 'Tab') {
        event.preventDefault();
        buttonRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      root.style.overflow = previous.root;
      body.style.overflow = previous.body;
      siblings.forEach((element, index) => { element.inert = previousInert[index]; });
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [complete, finish]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    const hero = buttonRef.current?.closest('section');
    const cssDuration = hero ? getComputedStyle(hero).getPropertyValue('--intro-duration').trim() : '1600ms';
    const duration = parseFloat(cssDuration) * (cssDuration.endsWith('ms') ? 1 : 1000);
    const timer = window.setTimeout(finish, duration);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { if (reduced.matches) finish(); };
    reduced.addEventListener('change', onPreference);
    return () => { clearTimeout(timer); reduced.removeEventListener('change', onPreference); };
  }, [phase, finish]);

  return { phase, complete, moonRequested, enter, finish, buttonRef, titleRef };
}
