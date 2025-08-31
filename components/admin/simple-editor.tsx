'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface SimpleEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
  className?: string
}

export default function SimpleEditor({
  initialContent = '',
  onChange,
  placeholder = "İçeriğinizi yazın...",
  editable = true,
  className = ''
}: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: initialContent,
    editable: editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  if (!editor) {
    return <div className="h-48 bg-gray-100 animate-pulse rounded border" />
  }

  return (
    <div className={`simple-editor ${className}`}>
      <EditorContent 
        editor={editor} 
        className="min-h-[200px] w-full border rounded-lg p-4 prose prose-lg dark:prose-invert max-w-full focus-within:ring-2 focus-within:ring-blue-500"
      />
    </div>
  )
}