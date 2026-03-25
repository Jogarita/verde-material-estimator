interface Props {
  label: string;
  value: number | string;
  decimals?: number;
  unit?: string;
}

export function OutputField({ label, value, decimals = 2, unit }: Props) {
  const display = typeof value === 'number'
    ? value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : value;
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}{unit && <span className="text-gray-400 ml-1">({unit})</span>}</span>
      <span className="text-sm font-semibold text-green-800">{display}</span>
    </div>
  );
}
