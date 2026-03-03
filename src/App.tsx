import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTodos } from './hooks/useTodos'
import { useDarkMode } from './hooks/useDarkMode'
import { useNotifications } from './hooks/useNotifications'
import { AuthForm } from './components/Auth/AuthForm'
import { Header } from './components/Layout/Header'
import { FilterBar } from './components/Todo/FilterBar'
import { TodoInput } from './components/Todo/TodoInput'
import { TodoList } from './components/Todo/TodoList'
import { TodoControls } from './components/Todo/TodoControls'
import { SearchBar } from './components/Todo/SearchBar'
import { StatsModal } from './components/Stats/StatsModal'

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { isDark, toggle: toggleDark } = useDarkMode()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-sm">로딩 중...</p>
      </div>
    )
  }

  if (!user) return <AuthForm />

  return (
    <TodoApp
      userId={user.id}
      email={user.email ?? ''}
      isDark={isDark}
      onToggleDark={toggleDark}
      onSignOut={signOut}
    />
  )
}

function TodoApp({
  userId,
  email,
  isDark,
  onToggleDark,
  onSignOut,
}: {
  userId: string
  email: string
  isDark: boolean
  onToggleDark: () => void
  onSignOut: () => void
}) {
  const [showStats, setShowStats] = useState(false)

  const {
    todos,
    allTodos,
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
  } = useTodos(userId)

  const { requestPermission, permission } = useNotifications(allTodos)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        email={email}
        completedCount={completedCount}
        totalCount={totalCount}
        isDark={isDark}
        notificationPermission={permission}
        onSignOut={onSignOut}
        onToggleDark={onToggleDark}
        onOpenStats={() => setShowStats(true)}
        onRequestNotification={requestPermission}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <TodoInput onAdd={addTodo} />
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar current={filter} onChange={setFilter} />
        <TodoControls
          sort={sort}
          onSortChange={setSort}
          hideCompleted={hideCompleted}
          onHideCompletedChange={setHideCompleted}
          completedCount={completedCount}
          onDeleteCompleted={deleteCompleted}
        />
        <TodoList
          todos={todos}
          loading={loading}
          isDraggable={sort === 'manual'}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onReorder={reorderTodos}
        />
      </main>

      {showStats && (
        <StatsModal todos={allTodos} onClose={() => setShowStats(false)} />
      )}
    </div>
  )
}
