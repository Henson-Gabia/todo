interface HeaderProps {
  email: string
  completedCount: number
  totalCount: number
  onSignOut: () => void
}

export function Header({ email, completedCount, totalCount, onSignOut }: HeaderProps) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">✅ Todo</h1>
          {totalCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {completedCount}/{totalCount}
              </span>
            </div>
          )}
        </div>
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
