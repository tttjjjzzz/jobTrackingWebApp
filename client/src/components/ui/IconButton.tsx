import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
    );
  },
);

IconButton.displayName = 'IconButton';
