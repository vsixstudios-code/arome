import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (user) setPhase(1);
      else setPhase(2);
    }, 2500);
    return () => clearTimeout(timer1);
  }, [user]);

  useEffect(() => {
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 2000);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      const t = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  const displayName = user?.firstName || 'there';

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
          style={{ backgroundColor: 'var(--color-bg-base)' }}
        >
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <h1
                  className="text-6xl font-serif font-medium mb-4 tracking-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Arome
                </h1>
                <p className="section-label tracking-[0.3em]">Find what fits the moment.</p>
              </motion.div>
            )}
            {phase === 1 && user && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <h2
                  className="text-4xl font-serif font-medium tracking-tight leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {greeting},<br />
                  <span style={{ color: 'var(--color-accent)' }}>{displayName}</span>
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
