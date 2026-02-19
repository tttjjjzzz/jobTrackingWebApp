import { useState } from 'react';
import { cn } from '../../utils/cn';

interface CompanyLogoProps {
  logoUrl?: string | null;
  company: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Deterministic glassmorphism-compatible color palette
const FALLBACK_COLORS = [
  'bg-indigo-500/30 text-indigo-300',
  'bg-purple-500/30 text-purple-300',
  'bg-blue-500/30 text-blue-300',
  'bg-emerald-500/30 text-emerald-300',
  'bg-amber-500/30 text-amber-300',
  'bg-rose-500/30 text-rose-300',
  'bg-cyan-500/30 text-cyan-300',
  'bg-orange-500/30 text-orange-300',
];

function getColorClass(company: string): string {
  const hash = company
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function CompanyLogo({
  logoUrl,
  company,
  size = 'md',
  className,
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = !!logoUrl && !imgError;
  const initial = (company.trim().charAt(0) || '?').toUpperCase();
  const colorClass = getColorClass(company);

  return (
    <div
      className={cn(
        'flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center',
        sizeClasses[size],
        !showImage && colorClass,
        className,
      )}
      title={company}
    >
      {showImage ? (
        <img
          src={logoUrl}
          alt={`${company} logo`}
          className="w-full h-full object-contain p-0.5"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-semibold leading-none select-none">{initial}</span>
      )}
    </div>
  );
}
