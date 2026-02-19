import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      />
      <div className="relative glass w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'rgba(20, 21, 28, 0.92)' }}>
        <div className="flex items-center justify-between p-6 pb-0">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </h2>
          )}
          <IconButton label="Close" onClick={onClose} className="ml-auto">
            <X size={18} />
          </IconButton>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
