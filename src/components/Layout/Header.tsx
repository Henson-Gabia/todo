import type { ViewMode } from '../../types/todo'

interface HeaderProps {
  email: string
  completedCount: number
  totalCount: number
  isDark: boolean
  notificationPermission: string
  viewMode: ViewMode
  onSignOut: () => void
  onToggleDark: () => void
  onOpenStats: () => void
  onRequestNotification: () => void
  onToggleView: () => void
}

export function Header({
  email, completedCount, totalCount, isDark, notificationPermission, viewMode,
  onSignOut, onToggleDark, onOpenStats, onRequestNotification, onToggleView,
}: HeaderProps) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
      <div className="max-w-2xl mx-auto">
        {/* 메인 행: 타이틀 + 아이콘 버튼들 */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">✅ Todo</h1>

          <div className="flex items-center gap-0.5">
            <button onClick={onToggleView} title={viewMode === 'list' ? '캘린더 뷰' : '목록 뷰'}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'calendar' ? 'text-blue-500 bg-blue-50 dark:bg-blue-950' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              {viewMode === 'list' ? '📅' : '📋'}
            </button>
            <button onClick={onOpenStats} title="통계"
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">📊</button>
            <button onClick={onRequestNotification} title={notificationPermission === 'granted' ? '알림 활성화됨' : '알림 허용'}
              className={`p-1.5 rounded-lg transition-colors ${notificationPermission === 'granted' ? 'text-blue-500' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>🔔</button>
            <button onClick={onToggleDark} title="다크모드"
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? '☀️' : '🌙'}
            </button>
            {/* 데스크탑: 이메일 + 로그아웃 */}
            <span className="hidden sm:block text-sm text-gray-400 dark:text-gray-500 mx-1">|</span>
            <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 truncate max-w-32">{email}</span>
            <button onClick={onSignOut}
              className="hidden sm:block text-xs text-gray-600 dark:text-gray-400 hover:text-red-500 border border-gray-300 dark:border-gray-600 hover:border-red-300 rounded-lg px-2 py-1.5 transition-colors ml-1">
              로그아웃
            </button>
          </div>
        </div>

        {/* 모바일 2번째 행: 진행바 + 로그아웃 */}
        <div className="sm:hidden flex items-center justify-between mt-1.5">
          {totalCount > 0 && viewMode === 'list' ? (
            <div className="flex items-center gap-2">
              <div className="w-28 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{completedCount}/{totalCount} ({percent}%)</span>
            </div>
          ) : <div />}
          <button onClick={onSignOut}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-500 border border-gray-300 dark:border-gray-600 hover:border-red-300 rounded-lg px-2.5 py-1 transition-colors">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
