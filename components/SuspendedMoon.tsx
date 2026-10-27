'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import moonCatImage from '../public/images/moon-cat.webp';
import styles from './SuspendedMoon.module.css';

type Props = { requested: boolean; introComplete: boolean };

export default function SuspendedMoon({ requested, introComplete }: Props) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!requested) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const settleIfReduced = () => { if (reduced.matches) setSettled(true); };
    settleIfReduced();
    reduced.addEventListener('change', settleIfReduced);
    return () => reduced.removeEventListener('change', settleIfReduced);
  }, [requested]);

  // Keep the same animation state when the Hero finishes opening: no replay.
  // Skipping the intro exposes the final object without triggering its fall.
  const state = settled ? 'settled' : requested ? 'falling' : introComplete ? 'settled' : 'hidden';
  return (
    <div className={styles.rig} data-moon={state} aria-hidden="true">
      <div className={styles.swing} data-moon-swing>
        <span className={styles.cord} data-moon-cord />
        <div className={styles.drop} data-moon-drop>
          <div className={styles.tilt} data-moon-tilt onAnimationEnd={() => setSettled(true)}>
            <Image
              src={moonCatImage}
              alt=""
              sizes="(max-width:1023px) 20vw, 18vw"
              loading="eager"
              quality={90}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
