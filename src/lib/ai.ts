import Anthropic from '@anthropic-ai/sdk'
import type { Category, Priority } from '../types/todo'

export interface AISuggestion {
  category: Category
  priority: Priority
  tags: string[]
}

const VALID_CATEGORIES: Category[] = ['personal', 'work', 'shopping', 'other']
const VALID_PRIORITIES: Priority[] = ['high', 'medium', 'low']

export async function getSuggestion(content: string): Promise<AISuggestion | null> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return null

  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Analyze this todo item and suggest category, priority, and up to 3 tags.
Todo: "${content}"
Categories: personal, work, shopping, other
Priorities: high(긴급), medium(보통), low(여유)
Tags: Korean if input is Korean, short keywords

Respond ONLY with JSON:
{"category": "work", "priority": "high", "tags": ["회의", "보고서"]}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0])
    const category: Category = VALID_CATEGORIES.includes(parsed.category) ? parsed.category : 'personal'
    const priority: Priority = VALID_PRIORITIES.includes(parsed.priority) ? parsed.priority : 'medium'
    const tags: string[] = Array.isArray(parsed.tags)
      ? parsed.tags.filter((t: unknown) => typeof t === 'string').slice(0, 3)
      : []

    return { category, priority, tags }
  } catch {
    return null
  }
}
