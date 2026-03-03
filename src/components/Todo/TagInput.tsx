import { useState } from 'react'

const TAG_COLORS = [
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
]

export function getTagColor(tag: string) {
  let hash = 0
  for (const c of tag) hash = (hash * 31 + c.charCodeAt(0)) % TAG_COLORS.length
  return TAG_COLORS[hash]
}

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim().replace(/^#/, '')
    if (tag && !tags.includes(tag)) onChange([...tags, tag])
    setInput('')
  }

  const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag))

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map(tag => (
        <span key={tag} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(tag)}`}>
          #{tag}
          <button onClick={() => removeTag(tag)} className="hover:opacity-70 leading-none">×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
        placeholder="태그 입력 후 Enter"
        className="text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-28"
      />
    </div>
  )
}
