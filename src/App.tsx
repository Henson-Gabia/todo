import { useAuth } from './hooks/useAuth'
import { useTodos } from './hooks/useTodos'
import { AuthForm } from './components/Auth/AuthForm'
import { Header } from './components/Layout/Header'
import { FilterBar } from './components/Todo/FilterBar'
import { TodoInput } from './components/Todo/TodoInput'
import { TodoList } from './components/Todo/TodoList'

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">로딩 중...</p>
      </div>
    )
  }

  if (!user) return <AuthForm />

  return <TodoApp userId={user.id} email={user.email ?? ''} onSignOut={signOut} />
}

function TodoApp({
  userId,
  email,
  onSignOut,
}: {
  userId: string
  email: string
  onSignOut: () => void
}) {
  const { todos, filter, setFilter, loading, addTodo, toggleTodo, deleteTodo } = useTodos(userId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header email={email} onSignOut={onSignOut} />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <TodoInput onAdd={addTodo} />
        <FilterBar current={filter} onChange={setFilter} />
        <TodoList
          todos={todos}
          loading={loading}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  )
}
