interface HeaderProps {
  email: string
  onSignOut: () => void
}

export function Header({ email, onSignOut }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">✅ Todo</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">{email}</span>
          <button
            onClick={onSignOut}
            className="text-sm text-gray-600 hover:text-red-500 border border-gray-300 hover:border-red-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
