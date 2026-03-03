import type { Filter } from '../../types/todo'
import { FILTER_LABELS } from '../../types/todo'

const FILTERS: Filter[] = ['all', 'today', 'personal', 'work', 'shopping', 'other']

interface FilterBarProps {
  current: Filter
  onChange: (filter: Filter) => void
}

export function FilterBar({ current, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            current === f
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          {FILTER_LABELS[f]}
        </button>
      ))}
    </div>
  )
}
