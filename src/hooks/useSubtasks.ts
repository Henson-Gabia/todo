import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Subtask } from '../types/todo'

export function useSubtasks(todoId: string | null) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!todoId) { setSubtasks([]); return }
    fetchSubtasks(todoId)
  }, [todoId])

  const fetchSubtasks = async (id: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .eq('todo_id', id)
      .order('created_at', { ascending: true })
    if (!error && data) setSubtasks(data as Subtask[])
    setLoading(false)
  }

  const addSubtask = async (todoId: string, content: string) => {
    const { data, error } = await supabase
      .from('subtasks')
      .insert([{ todo_id: todoId, content, completed: false }])
      .select()
      .single()
    if (!error && data) setSubtasks(prev => [...prev, data as Subtask])
  }

  const toggleSubtask = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('subtasks')
      .update({ completed: !completed })
      .eq('id', id)
    if (!error) {
      setSubtasks(prev => prev.map(s => s.id === id ? { ...s, completed: !completed } : s))
    }
  }

  const deleteSubtask = async (id: string) => {
    const { error } = await supabase.from('subtasks').delete().eq('id', id)
    if (!error) setSubtasks(prev => prev.filter(s => s.id !== id))
  }

  const completedCount = subtasks.filter(s => s.completed).length

  return { subtasks, loading, completedCount, addSubtask, toggleSubtask, deleteSubtask }
}
