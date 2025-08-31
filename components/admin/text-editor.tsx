"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function RichTextEditor({
  initialContent = "",
  onChange,
  placeholder = "İçeriğinizi yazın...",
  editable = true,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'prose-bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'prose-ordered-list',
        },
      }),
      ListItem,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: initialContent,
    editable: editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  if (!editor) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded border" />;
  }

  return (
    <div className={`rich-text-editor border rounded-none ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap items-center gap-1 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        {/* Text Formatting */}
        <Button
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("code") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8 p-0"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Headings */}
        <Button
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() => {
            console.log("H1 button clicked");
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Lists */}
        <Button
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            console.log("Bullet list button clicked");
            editor.chain().focus().toggleBulletList().run();
          }}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Quote */}
        <Button
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="max-h-[300px] overflow-y-auto">
        <EditorContent
          editor={editor}
          className="min-h-[300px] w-full p-4 prose prose-lg dark:prose-invert max-w-full outline-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_li]:mb-1"
        />
      </div>
    </div>
  );
}
