import { useState, useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { logosApi, type LogoCandidate } from '../../api/logos.api';
import { CompanyLogo } from '../ui/CompanyLogo';
import { cn } from '../../utils/cn';

interface LogoPickerProps {
  company: string;
  currentLogoUrl?: string | null;
  onSelect: (url: string | null) => void;
  onClose: () => void;
}

const sourceLabel: Record<string, string> = {
  clearbit: 'Clearbit',
  google_favicon: 'Favicon',
};

export function LogoPicker({
  company,
  currentLogoUrl,
  onSelect,
  onClose,
}: LogoPickerProps) {
  const [candidates, setCandidates] = useState<LogoCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(
    currentLogoUrl ?? null,
  );
  const ref = useRef<HTMLDivElement>(null);

  // Fetch candidates on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    logosApi
      .search(company)
      .then((res) => {
        if (!cancelled) {
          setCandidates(res.data.candidates);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load logo suggestions');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [company]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function handleSelect(url: string) {
    setSelected(url);
    onSelect(url);
  }

  function handleClear() {
    setSelected(null);
    onSelect(null);
  }

  return (
    <div
      ref={ref}
      className="absolute z-20 top-full mt-1 left-0 glass rounded-xl p-3 shadow-xl min-w-[200px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">
          Select a logo
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close logo picker"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <X size={14} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-3">
          <Loader2
            size={18}
            className="animate-spin text-[var(--color-text-muted)]"
          />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-400 py-2">{error}</p>}

      {/* Candidates */}
      {!loading && !error && (
        <div className="flex gap-2 items-end flex-wrap">
          {candidates.map((candidate) => (
            <button
              key={candidate.url}
              type="button"
              onClick={() => handleSelect(candidate.url)}
              className={cn(
                'flex flex-col items-center gap-1 p-1.5 rounded-lg',
                selected === candidate.url
                  ? 'bg-accent/20 ring-1 ring-accent/60'
                  : 'hover:bg-white/10',
              )}
              title={sourceLabel[candidate.source] ?? candidate.source}
            >
              <CompanyLogo
                logoUrl={candidate.url}
                company={company}
                size="lg"
              />
              <span className="text-[10px] text-[var(--color-text-muted)]">
                {sourceLabel[candidate.source] ?? candidate.source}
              </span>
            </button>
          ))}

          {/* None / clear button — only shown when a logo is selected */}
          {selected && (
            <button
              type="button"
              onClick={handleClear}
              className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-white/10"
              title="Remove logo"
            >
              <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                <X size={14} className="text-[var(--color-text-muted)]" />
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">
                None
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
