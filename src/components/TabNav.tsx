interface Tab {
  label: string;
  badge?: string;
}

interface Props {
  tabs: Tab[];
  active: number;
  onChange: (index: number) => void;
}

export function TabNav({ tabs, active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          onClick={() => onChange(i)}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
            i === active
              ? 'border-b-2 border-green-600 text-green-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {tab.badge && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              i === active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
