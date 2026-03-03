import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Todo } from '../../types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  loading: boolean
  isDraggable: boolean
  userId: string
  onToggle: (id: string, completed: boolean) => void
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'content' | 'category' | 'priority' | 'due_date' | 'tags'>>) => void
  onDelete: (id: string) => void
  onShare: (id: string, email: string) => void
  onUnshare: (id: string, email: string) => void
  onReorder: (reordered: Todo[]) => void
  onTagClick: (tag: string) => void
}

export function TodoList({ todos, loading, isDraggable, userId, onToggle, onUpdate, onDelete, onShare, onUnshare, onReorder, onTagClick }: TodoListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = todos.findIndex(t => t.id === active.id)
    const newIndex = todos.findIndex(t => t.id === over.id)
    const reordered = [...todos]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    onReorder(reordered)
  }

  if (loading) return <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">불러오는 중...</div>

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500">
        <p className="text-3xl mb-2">📋</p>
        <p className="text-sm">할일이 없습니다</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isDraggable={isDraggable}
              isOwner={todo.user_id === userId}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onShare={onShare}
              onUnshare={onUnshare}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
