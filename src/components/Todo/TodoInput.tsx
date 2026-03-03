import { useState } from 'react'
import type { Category, Priority, NewTodo } from '../../types/todo'
import { CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_EMOJI } from '../../types/todo'

interface TodoInputProps {
  onAdd: (todo: NewTodo) => void
}

const CATEGORIES: Category[] = ['personal', 'work', 'shopping', 'other']
const PRIORITIES: Priority[] = ['high', 'medium', 'low']

export function TodoInput({ onAdd }: TodoInputProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category>('personal')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = () => {
    if (!content.trim()) return
    onAdd({
      content: content.trim(),
      category,
      priority,
      due_date: dueDate || null,
    })
    setContent('')
    setDueDate('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할일을 입력하세요..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          추가
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium">카테고리</span>
          <div className="flex gap-1">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  category === c
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium">중요도</span>
          <div className="flex gap-1">
            {PRIORITIES.map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  priority === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {PRIORITY_EMOJI[p]} {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium">마감일</span>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
