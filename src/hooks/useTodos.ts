import { useEffect, useState } from 'react'
import { format, isToday } from 'date-fns'
import { supabase } from '../lib/supabase'
import type { Todo, NewTodo, Filter, Category } from '../types/todo'

export function useTodos(userId: string) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
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
      .insert([{ ...newTodo, user_id: userId, completed: false }])
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
      setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !completed } : t)
      )
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (!error) setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    if (filter === 'today') {
      return todo.due_date ? isToday(new Date(todo.due_date)) : false
    }
    return todo.category === (filter as Category)
  })

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
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
