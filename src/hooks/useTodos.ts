import { useEffect, useState } from 'react'
import { format, isToday } from 'date-fns'
import { supabase } from '../lib/supabase'
import type { Todo, NewTodo, Filter, Sort, Category } from '../types/todo'
import { PRIORITY_ORDER } from '../types/todo'

export function useTodos(userId: string, userEmail: string) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('created')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [userId, userEmail])

  const fetchTodos = async () => {
    setLoading(true)
    const [ownResult, sharedResult] = await Promise.all([
      supabase.from('todos').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('todos').select('*').contains('shared_with_emails', [userEmail]).order('created_at', { ascending: false }),
    ])
    const own = (ownResult.data ?? []) as Todo[]
    const shared = (sharedResult.data ?? []) as Todo[]
    const merged = [...own, ...shared.filter(s => !own.find(o => o.id === s.id))]
    setTodos(merged)
    setLoading(false)
  }

  const addTodo = async (newTodo: NewTodo) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ ...newTodo, user_id: userId, completed: false, position: null, shared_with_emails: [] }])
      .select()
      .single()
    if (!error && data) setTodos(prev => [data as Todo, ...prev])
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    if (!error) setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
  }

  const updateTodo = async (id: string, updates: Partial<Pick<Todo, 'content' | 'category' | 'priority' | 'due_date' | 'tags'>>) => {
    const { error } = await supabase.from('todos').update(updates).eq('id', id)
    if (!error) setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (!error) setTodos(prev => prev.filter(t => t.id !== id))
  }

  const deleteCompleted = async () => {
    const ids = todos.filter(t => t.completed && t.user_id === userId).map(t => t.id)
    if (!ids.length) return
    const { error } = await supabase.from('todos').delete().in('id', ids)
    if (!error) setTodos(prev => prev.filter(t => !ids.includes(t.id)))
  }

  const shareTodo = async (id: string, email: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const emails = [...new Set([...(todo.shared_with_emails ?? []), email])]
    const { error } = await supabase.from('todos').update({ shared_with_emails: emails }).eq('id', id)
    if (!error) setTodos(prev => prev.map(t => t.id === id ? { ...t, shared_with_emails: emails } : t))
  }

  const unshareTodo = async (id: string, email: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const emails = (todo.shared_with_emails ?? []).filter(e => e !== email)
    const { error } = await supabase.from('todos').update({ shared_with_emails: emails }).eq('id', id)
    if (!error) setTodos(prev => prev.map(t => t.id === id ? { ...t, shared_with_emails: emails } : t))
  }

  const reorderTodos = async (reordered: Todo[]) => {
    setTodos(prev => {
      const ids = reordered.map(t => t.id)
      const rest = prev.filter(t => !ids.includes(t.id))
      return [...reordered.map((t, i) => ({ ...t, position: i })), ...rest]
    })
    for (let i = 0; i < reordered.length; i++) {
      await supabase.from('todos').update({ position: i }).eq('id', reordered[i].id)
    }
  }

  const completedCount = todos.filter(t => t.completed && t.user_id === userId).length
  const totalCount = todos.filter(t => t.user_id === userId).length

  const allTags = [...new Set(todos.flatMap(t => t.tags ?? []))]

  const filteredAndSorted = todos
    .filter(todo => {
      if (hideCompleted && todo.completed) return false
      if (search && !todo.content.toLowerCase().includes(search.toLowerCase())) return false
      if (tagFilter && !(todo.tags ?? []).includes(tagFilter)) return false
      if (filter === 'all') return true
      if (filter === 'today') return todo.due_date ? isToday(new Date(todo.due_date)) : false
      if (filter === 'shared') return todo.user_id !== userId
      return todo.category === (filter as Category)
    })
    .sort((a, b) => {
      if (sort === 'manual') {
        if (a.position !== null && b.position !== null) return a.position - b.position
        if (a.position !== null) return -1
        if (b.position !== null) return 1
        return b.created_at.localeCompare(a.created_at)
      }
      if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sort === 'due_date') {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return a.due_date.localeCompare(b.due_date)
      }
      return b.created_at.localeCompare(a.created_at)
    })

  return {
    todos: filteredAndSorted,
    allTodos: todos,
    filter, setFilter,
    sort, setSort,
    hideCompleted, setHideCompleted,
    search, setSearch,
    tagFilter, setTagFilter,
    loading,
    completedCount,
    totalCount,
    allTags,
    addTodo, toggleTodo, updateTodo, deleteTodo, deleteCompleted,
    shareTodo, unshareTodo, reorderTodos,
  }
}

export function getDDayInfo(dueDate: string | null): { label: string; className: string } | null {
  if (!dueDate) return null
  const today = new Date(format(new Date(), 'yyyy-MM-dd'))
  const due = new Date(dueDate)
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: `D+${Math.abs(diff)}`, className: 'bg-red-800 text-white' }
  if (diff === 0) return { label: 'D-Day', className: 'bg-red-500 text-white' }
  if (diff <= 2) return { label: `D-${diff}`, className: 'bg-orange-400 text-white' }
  return { label: `D-${diff}`, className: 'bg-gray-200 text-gray-600' }
}
