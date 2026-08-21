import React from 'react'

interface FormattedContentProps {
  text?: string
  className?: string
  textColor?: string
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'numbered-list'; items: { number: string; text: string }[] }

export default function FormattedContent({
  text = '',
  className = '',
  textColor = 'var(--color-ink)'
}: FormattedContentProps) {
  if (!text || !text.trim()) {
    return null
  }

  const lines = text.split('\n')
  const blocks: ContentBlock[] = []

  let currentBulletItems: string[] = []
  let currentNumberedItems: { number: string; text: string }[] = []
  let currentParagraphLines: string[] = []

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const paragraphText = currentParagraphLines.join('\n').trim()
      if (paragraphText) {
        blocks.push({ type: 'paragraph', text: paragraphText })
      }
      currentParagraphLines = []
    }
  }

  const flushBulletList = () => {
    if (currentBulletItems.length > 0) {
      blocks.push({ type: 'bullet-list', items: [...currentBulletItems] })
      currentBulletItems = []
    }
  }

  const flushNumberedList = () => {
    if (currentNumberedItems.length > 0) {
      blocks.push({ type: 'numbered-list', items: [...currentNumberedItems] })
      currentNumberedItems = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    if (!trimmed) {
      // Empty line -> flush whatever is open to create separation
      flushParagraph()
      flushBulletList()
      flushNumberedList()
      continue
    }

    // Check for bullet point: -, *, •, –, —
    const bulletMatch = trimmed.match(/^[-*•–—]\s+(.+)$/)
    // Check for numbered item: 1. or 1)
    const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.+)$/)

    if (bulletMatch) {
      flushParagraph()
      flushNumberedList()
      currentBulletItems.push(bulletMatch[1])
    } else if (numberedMatch) {
      flushParagraph()
      flushBulletList()
      currentNumberedItems.push({
        number: numberedMatch[1],
        text: numberedMatch[2]
      })
    } else {
      flushBulletList()
      flushNumberedList()
      currentParagraphLines.push(rawLine)
    }
  }

  // Flush remaining
  flushParagraph()
  flushBulletList()
  flushNumberedList()

  return (
    <div className={`flex flex-col gap-4 ${className}`} style={{ color: textColor }}>
      {blocks.map((block, idx) => {
        if (block.type === 'paragraph') {
          return (
            <p
              key={idx}
              className="text-base leading-relaxed whitespace-pre-line"
              style={{ color: textColor, maxWidth: '680px' }}
            >
              {block.text}
            </p>
          )
        }

        if (block.type === 'bullet-list') {
          return (
            <ul key={idx} className="flex flex-col gap-2.5 my-1" style={{ maxWidth: '680px' }}>
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-base leading-relaxed">
                  <span
                    className="inline-block shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-ink)', opacity: 0.7 }}
                    aria-hidden="true"
                  />
                  <span className="flex-1" style={{ color: textColor }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'numbered-list') {
          return (
            <ol key={idx} className="flex flex-col gap-2.5 my-1" style={{ maxWidth: '680px' }}>
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-base leading-relaxed">
                  <span
                    className="font-mono text-xs tracking-wider font-semibold shrink-0 mt-1 px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-muted)'
                    }}
                  >
                    {item.number.padStart(2, '0')}
                  </span>
                  <span className="flex-1" style={{ color: textColor }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ol>
          )
        }

        return null
      })}
    </div>
  )
}
