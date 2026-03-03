import { useState } from 'react'
import type { Category, Priority, NewTodo } from '../../types/todo'
import { CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_EMOJI } from '../../types/todo'
import { TagInput } from './TagInput'

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
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = () => {
    if (!content.trim()) return
    onAdd({ content: content.trim(), category, priority, due_date: dueDate || null, tags })
    setContent(''); setDueDate(''); setTags([])
  }

  const btnBase = 'px-2 py-1 rounded-md text-xs font-medium transition-colors'
  const btnActive = 'bg-blue-600 text-white'
  const btnInactive = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex gap-2">
        <input type="text" value={content} onChange={e => setContent(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="할일을 입력하세요..."
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">추가</button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">카테고리</span>
          <div className="flex flex-wrap gap-1">{CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className={`${btnBase} ${category === c ? btnActive : btnInactive}`}>{CATEGORY_LABELS[c]}</button>)}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">중요도</span>
          <div className="flex flex-wrap gap-1">{PRIORITIES.map(p => <button key={p} onClick={() => setPriority(p)} className={`${btnBase} ${priority === p ? btnActive : btnInactive}`}>{PRIORITY_EMOJI[p]} {PRIORITY_LABELS[p]}</button>)}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">마감일</span>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium pt-0.5">태그</span>
        <TagInput tags={tags} onChange={setTags} />
      </div>
    </div>
  )
}
