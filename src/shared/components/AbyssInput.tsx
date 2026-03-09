interface InputProps {
  label: string;
  icon?: string;
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  step?: number;
}

export function AbyssInput({ label, icon, value, onChange, min, step }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5 text-cyan-400/60">
        {icon && <span>{icon}</span>}
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min ?? 0}
        step={step ?? 0.01}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl text-sm font-medium
          bg-[#0a1628] border border-[rgba(8,60,90,0.8)] text-slate-200
          focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20
          transition-all duration-200
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}
