import type { Filter } from '../../types/todo'
import { FILTER_LABELS } from '../../types/todo'
import { getTagColor } from './TagInput'

const FILTERS: Filter[] = ['all', 'today', 'shared', 'personal', 'work', 'shopping', 'other']

interface FilterBarProps {
  current: Filter
  onChange: (filter: Filter) => void
  allTags: string[]
  tagFilter: string | null
  onTagFilter: (tag: string | null) => void
}

export function FilterBar({ current, onChange, allTags, tagFilter, onTagFilter }: FilterBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => onChange(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              current === f
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">#태그:</span>
          {allTags.map(tag => (
            <button key={tag} onClick={() => onTagFilter(tagFilter === tag ? null : tag)}
              className={`text-xs px-2 py-0.5 rounded-full font-medium transition-opacity ${getTagColor(tag)} ${tagFilter === tag ? 'ring-2 ring-offset-1 ring-blue-400' : 'hover:opacity-80'}`}
            >
              #{tag}
            </button>
          ))}
          {tagFilter && (
            <button onClick={() => onTagFilter(null)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕ 태그 해제
            </button>
          )}
        </div>
      )}
    </div>
  )
}
