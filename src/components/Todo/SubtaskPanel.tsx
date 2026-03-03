import { useState } from 'react'
import { useSubtasks } from '../../hooks/useSubtasks'

interface SubtaskPanelProps {
  todoId: string
}

export function SubtaskPanel({ todoId }: SubtaskPanelProps) {
  const { subtasks, loading, completedCount, addSubtask, toggleSubtask, deleteSubtask } = useSubtasks(todoId)
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    addSubtask(todoId, input.trim())
    setInput('')
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
      {subtasks.length > 0 && (
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all"
              style={{ width: `${subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
            {completedCount}/{subtasks.length}
          </span>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-gray-400">로딩 중...</p>
      ) : (
        subtasks.map(sub => (
          <div key={sub.id} className="flex items-center gap-2 group/sub">
            <input
              type="checkbox"
              checked={sub.completed}
              onChange={() => toggleSubtask(sub.id, sub.completed)}
              className="w-3.5 h-3.5 accent-blue-500 cursor-pointer flex-shrink-0"
            />
            <span className={`text-xs flex-1 ${sub.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
              {sub.content}
            </span>
            <button
              onClick={() => deleteSubtask(sub.id)}
              className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-sm opacity-0 group-hover/sub:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))
      )}

      <div className="flex gap-1.5 mt-1">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="하위 할일 추가..."
          className="flex-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
