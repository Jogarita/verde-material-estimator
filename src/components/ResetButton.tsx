interface Props {
  onClick: () => void;
}

export function ResetButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
      Reset to defaults
    </button>
  );
}
