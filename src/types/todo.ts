export type Category = 'personal' | 'work' | 'shopping' | 'other'
export type Priority = 'high' | 'medium' | 'low'
export type Filter = 'all' | 'today' | Category
export type Sort = 'created' | 'due_date' | 'priority'

export const SORT_LABELS: Record<Sort, string> = {
  created: '최신순',
  due_date: '마감일순',
  priority: '중요도순',
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export interface Todo {
  id: string
  user_id: string
  content: string
  completed: boolean
  category: Category
  priority: Priority
  due_date: string | null
  created_at: string
}

export interface NewTodo {
  content: string
  category: Category
  priority: Priority
  due_date: string | null
}

export const CATEGORY_LABELS: Record<Category, string> = {
  personal: '개인',
  work: '업무',
  shopping: '쇼핑',
  other: '기타',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  personal: 'bg-blue-100 text-blue-700',
  work: 'bg-purple-100 text-purple-700',
  shopping: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: '높음',
  medium: '보통',
  low: '낮음',
}

export const PRIORITY_BORDER: Record<Priority, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-400',
  low: 'border-l-green-400',
}

export const PRIORITY_EMOJI: Record<Priority, string> = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
}

export const FILTER_LABELS: Record<Filter, string> = {
  all: '전체',
  today: '오늘 마감',
  personal: '개인',
  work: '업무',
  shopping: '쇼핑',
  other: '기타',
}
