interface HeaderProps {
  email: string
  completedCount: number
  totalCount: number
  isDark: boolean
  notificationPermission: string
  onSignOut: () => void
  onToggleDark: () => void
  onOpenStats: () => void
  onRequestNotification: () => void
}

export function Header({
  email,
  completedCount,
  totalCount,
  isDark,
  notificationPermission,
  onSignOut,
  onToggleDark,
  onOpenStats,
  onRequestNotification,
}: HeaderProps) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">✅ Todo</h1>
          {totalCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completedCount}/{totalCount}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenStats}
            title="통계"
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            📊
          </button>
          <button
            onClick={onRequestNotification}
            title={notificationPermission === 'granted' ? '알림 활성화됨' : '알림 허용'}
            className={`p-1.5 rounded-lg transition-colors ${
              notificationPermission === 'granted'
                ? 'text-blue-500'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            🔔
          </button>
          <button
            onClick={onToggleDark}
            title="다크모드"
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <span className="text-sm text-gray-400 dark:text-gray-500 hidden sm:block mx-1">|</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{email}</span>
          <button
            onClick={onSignOut}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 border border-gray-300 dark:border-gray-600 hover:border-red-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
