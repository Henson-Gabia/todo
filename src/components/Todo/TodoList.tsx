import type { Todo } from '../../types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  loading: boolean
  onToggle: (id: string, completed: boolean) => void
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'content' | 'category' | 'priority' | 'due_date'>>) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, loading, onToggle, onUpdate, onDelete }: TodoListProps) {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">불러오는 중...</div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-3xl mb-2">📋</p>
        <p className="text-sm">할일이 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
