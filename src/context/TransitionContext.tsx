import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransitionContextType {
  isTransitioning: boolean;
  targetPath: string | null;
  startTransition: (path: string) => void;
  completeTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const navigate = useNavigate();

  const startTransition = (path: string) => {
    setTargetPath(path);
    setIsTransitioning(true);
  };

  const completeTransition = () => {
    if (targetPath) {
      navigate(targetPath);
      // We keep isTransitioning true briefly while navigating, 
      // but the component itself will handle animating out, so we set it to false.
      setIsTransitioning(false);
      setTargetPath(null);
    }
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, targetPath, startTransition, completeTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
