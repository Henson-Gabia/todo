import { useEffect, useState } from 'react'
import { format, isToday } from 'date-fns'
import { supabase } from '../lib/supabase'
import type { Todo, NewTodo, Filter, Sort, Category } from '../types/todo'
import { PRIORITY_ORDER } from '../types/todo'

export function useTodos(userId: string) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('created')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [userId])

  const fetchTodos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) setTodos(data as Todo[])
    setLoading(false)
  }

  const addTodo = async (newTodo: NewTodo) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ ...newTodo, user_id: userId, completed: false, position: null }])
      .select()
      .single()

    if (!error && data) setTodos(prev => [data as Todo, ...prev])
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id)

    if (!error) {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
    }
  }

  const updateTodo = async (id: string, updates: Partial<Pick<Todo, 'content' | 'category' | 'priority' | 'due_date'>>) => {
    const { error } = await supabase.from('todos').update(updates).eq('id', id)
    if (!error) {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (!error) setTodos(prev => prev.filter(t => t.id !== id))
  }

  const deleteCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id)
    if (completedIds.length === 0) return
    const { error } = await supabase.from('todos').delete().in('id', completedIds)
    if (!error) setTodos(prev => prev.filter(t => !t.completed))
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

  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  const filteredAndSorted = todos
    .filter(todo => {
      if (hideCompleted && todo.completed) return false
      if (search && !todo.content.toLowerCase().includes(search.toLowerCase())) return false
      if (filter === 'all') return true
      if (filter === 'today') return todo.due_date ? isToday(new Date(todo.due_date)) : false
      return todo.category === (filter as Category)
    })
    .sort((a, b) => {
      if (sort === 'manual') {
        if (a.position !== null && b.position !== null) return a.position - b.position
        if (a.position !== null) return -1
        if (b.position !== null) return 1
        return b.created_at.localeCompare(a.created_at)
      }
      if (sort === 'priority') {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      }
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
    loading,
    completedCount,
    totalCount,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    deleteCompleted,
    reorderTodos,
  }
}

export function getDDayInfo(dueDate: string | null): {
  label: string
  className: string
} | null {
  if (!dueDate) return null

  const today = new Date(format(new Date(), 'yyyy-MM-dd'))
  const due = new Date(dueDate)
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) {
    return { label: `D+${Math.abs(diff)}`, className: 'bg-red-800 text-white' }
  }
  if (diff === 0) {
    return { label: 'D-Day', className: 'bg-red-500 text-white' }
  }
  if (diff <= 2) {
    return { label: `D-${diff}`, className: 'bg-orange-400 text-white' }
  }
  return { label: `D-${diff}`, className: 'bg-gray-200 text-gray-600' }
}
