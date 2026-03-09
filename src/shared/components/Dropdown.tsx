import { useState, useRef, useEffect } from 'react';
import type { DropdownOption } from '../types';

interface DropdownProps {
  label: string;
  icon?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

/**
 * Dropdown that renders its menu as absolute-positioned within its own wrapper.
 *
 * IMPORTANT: Parent elements must NOT have `backdrop-filter`, `filter`, `transform`,
 * or `will-change` CSS — those CSS properties create a new stacking context and
 * clip child z-index. The panel cards deliberately omit backdrop-blur for this reason.
 */
export function Dropdown({ label, icon, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label className="text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 text-cyan-400/60">
        {icon && <span>{icon}</span>}
        {label}
      </label>

      {/*
        The wrapper gets position:relative + an elevated z-index when open so
        the absolutely-placed menu stacks above all sibling elements.
        No overflow:hidden or any stacking-context-creating property here.
      */}
      <div
        ref={wrapperRef}
        style={{ position: 'relative', zIndex: open ? 100 : 'auto' }}
      >
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium
            bg-[#0a1628] text-slate-200 transition-colors duration-150 text-left
            hover:border-cyan-700/50"
          style={{
            border: `1px solid ${open ? 'rgba(34,211,238,0.45)' : 'rgba(8,60,90,0.8)'}`,
          }}
        >
          <span
            className="truncate"
            dangerouslySetInnerHTML={{ __html: selected?.label ?? 'Select…' }}
          />
          <span
            className="ml-2 shrink-0 text-cyan-400/50 text-xs transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▼
          </span>
        </button>

        {/* Menu — position:absolute so it overlays siblings */}
        {open && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              zIndex: 100,
              background: '#060f1c',
              border: '1px solid rgba(34,211,238,0.18)',
              borderRadius: '12px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.85)',
              maxHeight: '220px',
              overflowY: 'auto',
              animation: 'dropdown-in 0.15s ease both',
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                dangerouslySetInnerHTML={{ __html: opt.label }}
                onMouseEnter={(e) => {
                  if (opt.value !== value)
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (opt.value !== value)
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  background: opt.value === value ? 'rgba(34,211,238,0.1)' : 'transparent',
                  color: opt.value === value ? '#67e8f9' : '#94a3b8',
                  border: 'none',
                  borderLeft: `2px solid ${opt.value === value ? 'rgba(34,211,238,0.5)' : 'transparent'}`,
                  display: 'block',
                  fontFamily: 'inherit',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
