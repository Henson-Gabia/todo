import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Todo } from '../../types/todo'
import { CATEGORY_LABELS, PRIORITY_LABELS } from '../../types/todo'
import { isAfter, startOfDay } from 'date-fns'

interface StatsModalProps {
  todos: Todo[]
  onClose: () => void
}

const CATEGORY_PIE_COLORS = ['#3b82f6', '#a855f7', '#22c55e', '#6b7280']
const PRIORITY_BAR_COLORS: Record<string, string> = {
  '높음': '#ef4444',
  '보통': '#eab308',
  '낮음': '#22c55e',
}

export function StatsModal({ todos, onClose }: StatsModalProps) {
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0
  const overdue = todos.filter(t =>
    !t.completed && t.due_date && isAfter(startOfDay(new Date()), new Date(t.due_date))
  ).length

  const categoryData = (['personal', 'work', 'shopping', 'other'] as const).map(cat => ({
    name: CATEGORY_LABELS[cat],
    value: todos.filter(t => t.category === cat).length,
  })).filter(d => d.value > 0)

  const priorityData = (['high', 'medium', 'low'] as const).map(p => ({
    name: PRIORITY_LABELS[p],
    전체: todos.filter(t => t.priority === p).length,
    완료: todos.filter(t => t.priority === p && t.completed).length,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">📊 통계</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 요약 카드 */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: '전체', value: total, color: 'text-blue-600' },
              { label: '완료', value: completed, color: 'text-green-600' },
              { label: '완료율', value: `${rate}%`, color: 'text-purple-600' },
              { label: '기한초과', value: overdue, color: 'text-red-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* 진행률 바 */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>진행률</span>
              <span>{completed}/{total}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>

          {/* 카테고리 분포 */}
          {categoryData.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">카테고리 분포</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={50}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CATEGORY_PIE_COLORS[i % CATEGORY_PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5">
                  {categoryData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CATEGORY_PIE_COLORS[i % CATEGORY_PIE_COLORS.length] }}
                      />
                      <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 중요도별 완료 현황 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">중요도별 현황</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={priorityData} barSize={20}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="전체" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="완료" radius={[4, 4, 0, 0]}>
                  {priorityData.map((d) => (
                    <Cell key={d.name} fill={PRIORITY_BAR_COLORS[d.name] ?? '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
