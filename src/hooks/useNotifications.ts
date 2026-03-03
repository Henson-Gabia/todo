import { useEffect } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import type { Todo } from '../types/todo'

export function useNotifications(todos: Todo[]) {
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const todayStr = new Date().toISOString().split('T')[0]
    const notifiedKey = `notified_${todayStr}`
    const notified = new Set<string>(JSON.parse(localStorage.getItem(notifiedKey) || '[]'))
    const today = new Date(todayStr)

    todos.forEach(todo => {
      if (todo.completed || !todo.due_date || notified.has(todo.id)) return

      const diff = differenceInCalendarDays(new Date(todo.due_date), today)

      if (diff === 1) {
        new Notification('⏰ 내일 마감 알림', {
          body: `"${todo.content}" 마감이 내일입니다!`,
        })
        notified.add(todo.id)
      } else if (diff === 0) {
        new Notification('🚨 오늘 마감 알림', {
          body: `"${todo.content}" 오늘까지입니다!`,
        })
        notified.add(todo.id)
      }
    })

    localStorage.setItem(notifiedKey, JSON.stringify([...notified]))
  }, [todos])

  const requestPermission = async () => {
    if (!('Notification' in window)) return 'unsupported'
    return await Notification.requestPermission()
  }

  const permission = 'Notification' in window ? Notification.permission : 'unsupported'

  return { requestPermission, permission }
}
