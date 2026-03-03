import { useState } from 'react'

interface ShareModalProps {
  todoContent: string
  sharedEmails: string[]
  onShare: (email: string) => void
  onUnshare: (email: string) => void
  onClose: () => void
}

export function ShareModal({ todoContent, sharedEmails, onShare, onUnshare, onClose }: ShareModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleShare = () => {
    if (!email.trim()) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일을 입력해 주세요.')
      return
    }
    if (sharedEmails.includes(email.trim())) {
      setError('이미 공유된 이메일입니다.')
      return
    }
    onShare(email.trim())
    setEmail('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">공유 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 truncate">
            📋 {todoContent}
          </p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">이메일로 공유</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleShare()}
                placeholder="email@example.com"
                className="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleShare}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                공유
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          {sharedEmails.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">공유된 사용자</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {sharedEmails.map(e => (
                  <div key={e} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5">
                    <span className="text-xs text-gray-700 dark:text-gray-300">{e}</span>
                    <button
                      onClick={() => onUnshare(e)}
                      className="text-xs text-red-500 hover:text-red-700 ml-2"
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
