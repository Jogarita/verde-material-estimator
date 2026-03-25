import { useState } from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  unit?: string;
  warning?: string;
}

export function InputField({ label, value, onChange, step = 1, unit, warning }: Props) {
  const [raw, setRaw] = useState<string | null>(null);
  const isEditing = raw !== null;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={isEditing ? raw : value.toString()}
          step={step}
          onFocus={() => setRaw(value === 0 ? '' : value.toString())}
          onBlur={() => {
            const parsed = parseFloat(raw || '');
            onChange(isNaN(parsed) ? 0 : parsed);
            setRaw(null);
          }}
          onChange={e => {
            const v = e.target.value;
            if (v === '' || v === '-' || /^-?\d*\.?\d*$/.test(v)) {
              setRaw(v);
              const parsed = parseFloat(v);
              if (!isNaN(parsed)) onChange(parsed);
            }
          }}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
            unit ? 'pr-12' : ''
          } ${
            warning
              ? 'border-amber-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
              : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500'
          }`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {warning && (
        <span className="text-xs text-amber-600 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {warning}
        </span>
      )}
    </div>
  );
}
