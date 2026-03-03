import type { Sort } from '../../types/todo'
import { SORT_LABELS } from '../../types/todo'

const SORTS: Sort[] = ['created', 'due_date', 'priority', 'manual']

interface TodoControlsProps {
  sort: Sort
  onSortChange: (sort: Sort) => void
  hideCompleted: boolean
  onHideCompletedChange: (hide: boolean) => void
  completedCount: number
  onDeleteCompleted: () => void
}

export function TodoControls({
  sort,
  onSortChange,
  hideCompleted,
  onHideCompletedChange,
  completedCount,
  onDeleteCompleted,
}: TodoControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">정렬</span>
        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
          {SORTS.map(s => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                sort === s
                  ? 'bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'
              }`}
            >
              {SORT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <div
            onClick={() => onHideCompletedChange(!hideCompleted)}
            className={`relative w-8 h-4 rounded-full transition-colors ${
              hideCompleted ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                hideCompleted ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">완료 숨김</span>
        </label>

        {completedCount > 0 && (
          <button
            onClick={onDeleteCompleted}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 hover:border-red-400 px-2.5 py-1 rounded-full transition-colors"
          >
            완료 삭제 ({completedCount})
          </button>
        )}
      </div>
    </div>
  )
}
