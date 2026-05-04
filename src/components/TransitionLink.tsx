import type { ReactNode, MouseEvent } from 'react';
import { useTransition } from '../context/TransitionContext';

interface TransitionLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export default function TransitionLink({ to, children, className, ...rest }: TransitionLinkProps) {
  const { startTransition } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startTransition(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}
