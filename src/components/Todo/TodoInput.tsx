import { useState, useEffect, useRef } from 'react'
import type { Category, Priority, NewTodo } from '../../types/todo'
import { CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_EMOJI } from '../../types/todo'
import { TagInput } from './TagInput'
import { getSuggestion } from '../../lib/ai'
import type { AISuggestion } from '../../lib/ai'

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

  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggested, setAiSuggested] = useState<AISuggestion | null>(null)
  const [userChangedCategory, setUserChangedCategory] = useState(false)
  const [userChangedPriority, setUserChangedPriority] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (content.trim().length < 5) {
      setAiSuggested(null)
      setAiLoading(false)
      return
    }

    setAiLoading(true)
    debounceRef.current = setTimeout(async () => {
      const suggestion = await getSuggestion(content.trim())
      setAiLoading(false)
      if (!suggestion) return

      setAiSuggested(suggestion)
      if (!userChangedCategory) setCategory(suggestion.category)
      if (!userChangedPriority) setPriority(suggestion.priority)
      if (suggestion.tags.length > 0) {
        setTags(prev => {
          const merged = [...new Set([...prev, ...suggestion.tags])]
          return merged.slice(0, 5)
        })
      }
    }, 800)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [content])

  const handleCategoryChange = (c: Category) => {
    setCategory(c)
    setUserChangedCategory(true)
  }

  const handlePriorityChange = (p: Priority) => {
    setPriority(p)
    setUserChangedPriority(true)
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    onAdd({ content: content.trim(), category, priority, due_date: dueDate || null, tags })
    setContent('')
    setDueDate('')
    setTags([])
    setAiSuggested(null)
    setUserChangedCategory(false)
    setUserChangedPriority(false)
  }

  const isAiCategory = (c: Category) => aiSuggested?.category === c
  const isAiPriority = (p: Priority) => aiSuggested?.priority === p
  const aiApplied = aiSuggested !== null

  const btnBase = 'px-2 py-1 rounded-md text-xs font-medium transition-colors relative'
  const btnActive = 'bg-blue-600 text-white'
  const btnInactive = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
  const btnAiHighlight = 'ring-1 ring-blue-300 dark:ring-blue-500'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="할일을 입력하세요..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          />
          {aiLoading && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </span>
          )}
        </div>
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">추가</button>
      </div>

      {aiApplied && !aiLoading && (
        <p className="text-xs text-blue-500 dark:text-blue-400">✨ AI가 분류했어요</p>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">카테고리</span>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`${btnBase} ${category === c ? btnActive : btnInactive} ${!userChangedCategory && isAiCategory(c) && category !== c ? btnAiHighlight : ''}`}
              >
                {!userChangedCategory && isAiCategory(c) && <span className="mr-0.5">✨</span>}
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">중요도</span>
          <div className="flex flex-wrap gap-1">
            {PRIORITIES.map(p => (
              <button
                key={p}
                onClick={() => handlePriorityChange(p)}
                className={`${btnBase} ${priority === p ? btnActive : btnInactive} ${!userChangedPriority && isAiPriority(p) && priority !== p ? btnAiHighlight : ''}`}
              >
                {!userChangedPriority && isAiPriority(p) && <span className="mr-0.5">✨</span>}
                {PRIORITY_EMOJI[p]} {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">마감일</span>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium pt-0.5">태그</span>
        <TagInput tags={tags} onChange={setTags} />
      </div>
    </div>
  )
}
