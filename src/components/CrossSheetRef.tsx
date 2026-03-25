interface Props {
  label: string;
  value: number;
  decimals?: number;
  source: string;
}

export function CrossSheetRef({ label, value, decimals = 2, source }: Props) {
  return (
    <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 rounded px-3 py-1.5">
      <span className="flex items-center gap-1">
        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" />
        </svg>
        {label}
        <span className="text-gray-400">({source})</span>
      </span>
      <span className="font-medium text-gray-700">
        {value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      </span>
    </div>
  );
}
