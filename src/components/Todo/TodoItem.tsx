import type { Todo } from '../../types/todo'
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  PRIORITY_BORDER,
  PRIORITY_EMOJI,
  PRIORITY_LABELS,
} from '../../types/todo'
import { getDDayInfo } from '../../hooks/useTodos'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const dday = getDDayInfo(todo.due_date)

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 border-l-4 ${PRIORITY_BORDER[todo.priority]} px-4 py-3 flex items-start gap-3 group transition-opacity ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
        className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className={`text-sm text-gray-800 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
          {todo.content}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[todo.category]}`}>
            {CATEGORY_LABELS[todo.category]}
          </span>
          <span className="text-xs text-gray-500">
            {PRIORITY_EMOJI[todo.priority]} {PRIORITY_LABELS[todo.priority]}
          </span>
          {dday && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dday.className}`}>
              {dday.label}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 text-lg leading-none mt-0.5 opacity-0 group-hover:opacity-100"
        aria-label="삭제"
      >
        ×
      </button>
    </div>
  )
}
