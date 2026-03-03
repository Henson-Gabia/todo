import { useState } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameDay, isSameMonth,
  isToday, format, isAfter, startOfDay,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Todo } from '../../types/todo'
import { PRIORITY_BORDER } from '../../types/todo'
import { getDDayInfo } from '../../hooks/useTodos'

interface CalendarViewProps {
  todos: Todo[]
}

export function CalendarView({ todos }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days: Date[] = []
  let d = calStart
  while (d <= calEnd) { days.push(d); d = addDays(d, 1) }

  const todosOnDay = (day: Date) =>
    todos.filter(t => t.due_date && isSameDay(new Date(t.due_date), day))

  const hasOverdue = (day: Date) =>
    todosOnDay(day).some(t => !t.completed && isAfter(startOfDay(new Date()), new Date(t.due_date!)))

  const selectedTodos = selectedDay ? todosOnDay(selectedDay) : []

  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="space-y-4">
      {/* 월 네비게이션 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            ‹
          </button>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            ›
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map(day => {
            const dayTodos = todosOnDay(day)
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const dayOfWeek = day.getDay()

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(isSameDay(day, selectedDay ?? new Date(0)) ? null : day)}
                className={`relative p-1.5 rounded-lg text-xs transition-colors min-h-[36px] flex flex-col items-center ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isToday(day)
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold'
                    : isCurrentMonth
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    : 'text-gray-300 dark:text-gray-600'
                } ${dayOfWeek === 0 && !isSelected ? 'text-red-400 dark:text-red-500' : ''} ${dayOfWeek === 6 && !isSelected ? 'text-blue-400 dark:text-blue-500' : ''}`}
              >
                <span>{format(day, 'd')}</span>
                {dayTodos.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayTodos.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-white' :
                          (!t.completed && hasOverdue(day)) ? 'bg-red-500' :
                          t.completed ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 선택된 날짜의 할일 목록 */}
      {selectedDay && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-1">
            {format(selectedDay, 'M월 d일 (EEE)', { locale: ko })} · {selectedTodos.length}개
          </p>
          {selectedTodos.length === 0 ? (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
              이 날짜에 마감 할일이 없습니다
            </div>
          ) : (
            selectedTodos.map(todo => {
              const dday = getDDayInfo(todo.due_date)
              return (
                <div
                  key={todo.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 ${PRIORITY_BORDER[todo.priority]} px-4 py-3 flex items-center gap-3 ${todo.completed ? 'opacity-60' : ''}`}
                >
                  <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {todo.completed && <span className="text-white text-xs">✓</span>}
                  </span>
                  <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                    {todo.content}
                  </span>
                  {dday && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dday.className}`}>
                      {dday.label}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
