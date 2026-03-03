import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo, Category, Priority } from '../../types/todo'
import {
  CATEGORY_LABELS, CATEGORY_COLORS,
  PRIORITY_BORDER, PRIORITY_EMOJI, PRIORITY_LABELS,
} from '../../types/todo'
import { getDDayInfo } from '../../hooks/useTodos'
import { TagInput, getTagColor } from './TagInput'
import { SubtaskPanel } from './SubtaskPanel'
import { ShareModal } from '../Sharing/ShareModal'

interface TodoItemProps {
  todo: Todo
  isDraggable: boolean
  isOwner: boolean
  onToggle: (id: string, completed: boolean) => void
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'content' | 'category' | 'priority' | 'due_date' | 'tags'>>) => void
  onDelete: (id: string) => void
  onShare: (id: string, email: string) => void
  onUnshare: (id: string, email: string) => void
  onTagClick: (tag: string) => void
}

const CATEGORIES: Category[] = ['personal', 'work', 'shopping', 'other']
const PRIORITIES: Priority[] = ['high', 'medium', 'low']

export function TodoItem({ todo, isDraggable, isOwner, onToggle, onUpdate, onDelete, onShare, onUnshare, onTagClick }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [editContent, setEditContent] = useState(todo.content)
  const [editCategory, setEditCategory] = useState<Category>(todo.category)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editDueDate, setEditDueDate] = useState(todo.due_date ?? '')
  const [editTags, setEditTags] = useState<string[]>(todo.tags ?? [])

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const dday = getDDayInfo(todo.due_date)
  const tags = todo.tags ?? []
  const sharedEmails = todo.shared_with_emails ?? []

  const btnBase = 'px-2 py-0.5 rounded-md text-xs font-medium transition-colors'
  const btnActive = 'bg-blue-600 text-white'
  const btnInactive = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'

  const handleSave = () => {
    if (!editContent.trim()) return
    onUpdate(todo.id, { content: editContent.trim(), category: editCategory, priority: editPriority, due_date: editDueDate || null, tags: editTags })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(todo.content); setEditCategory(todo.category)
    setEditPriority(todo.priority); setEditDueDate(todo.due_date ?? '')
    setEditTags(todo.tags ?? []); setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-400 border-l-4 ${PRIORITY_BORDER[editPriority]} px-4 py-3 space-y-3`}>
        <input type="text" value={editContent} onChange={e => setEditContent(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
          autoFocus className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">카테고리</span>
            <div className="flex flex-wrap gap-1">{CATEGORIES.map(c => <button key={c} onClick={() => setEditCategory(c)} className={`${btnBase} ${editCategory === c ? btnActive : btnInactive}`}>{CATEGORY_LABELS[c]}</button>)}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">중요도</span>
            <div className="flex flex-wrap gap-1">{PRIORITIES.map(p => <button key={p} onClick={() => setEditPriority(p)} className={`${btnBase} ${editPriority === p ? btnActive : btnInactive}`}>{PRIORITY_EMOJI[p]} {PRIORITY_LABELS[p]}</button>)}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 flex-shrink-0">마감일</span>
            <input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 text-xs bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1">태그</span>
          <TagInput tags={editTags} onChange={setEditTags} />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={handleCancel} className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">취소</button>
          <button onClick={handleSave} className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">저장</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={setNodeRef} style={style}
        className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 ${PRIORITY_BORDER[todo.priority]} px-4 py-3 group transition-opacity ${todo.completed ? 'opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          {isDraggable && (
            <span {...attributes} {...listeners} className="text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing mt-0.5 flex-shrink-0 select-none">⠿</span>
          )}
          <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id, todo.completed)}
            className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className={`text-sm text-gray-800 dark:text-gray-100 ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
              {todo.content}
              {sharedEmails.length > 0 && <span className="ml-1.5 text-xs text-blue-400" title={`공유: ${sharedEmails.join(', ')}`}>👥</span>}
              {!isOwner && <span className="ml-1.5 text-xs text-purple-400">공유됨</span>}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[todo.category]}`}>{CATEGORY_LABELS[todo.category]}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{PRIORITY_EMOJI[todo.priority]} {PRIORITY_LABELS[todo.priority]}</span>
              {dday && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dday.className}`}>{dday.label}</span>}
              {tags.map(tag => (
                <button key={tag} onClick={() => onTagClick(tag)} className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(tag)} hover:opacity-80 transition-opacity`}>#{tag}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button onClick={() => setShowSubtasks(s => !s)} className={`text-xs p-0.5 transition-colors ${showSubtasks ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`} title="하위 할일">☰</button>
            {isOwner && <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500 transition-colors text-sm p-0.5" title="수정">✏️</button>}
            {isOwner && <button onClick={() => setShowShare(true)} className="text-gray-400 hover:text-green-500 transition-colors text-sm p-0.5" title="공유">🔗</button>}
            {isOwner && <button onClick={() => onDelete(todo.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors text-lg leading-none" aria-label="삭제">×</button>}
          </div>
        </div>
        {showSubtasks && <SubtaskPanel todoId={todo.id} />}
      </div>

      {showShare && (
        <ShareModal
          todoContent={todo.content}
          sharedEmails={sharedEmails}
          onShare={email => onShare(todo.id, email)}
          onUnshare={email => onUnshare(todo.id, email)}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  )
}
