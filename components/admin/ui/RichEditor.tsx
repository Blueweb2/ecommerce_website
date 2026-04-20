"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false, // ✅ FIX for Next.js SSR
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // ✅ Sync external value (important for edit mode)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // ✅ Prevent crash before editor initializes
  if (!editor) {
    return (
      <div className="border rounded-2xl p-3 bg-white min-h-[150px] text-sm text-gray-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border rounded-2xl bg-white overflow-hidden">
      
      {/* 🔥 TOOLBAR */}
      <div className="flex flex-wrap gap-2 px-3 py-2 border-b bg-gray-50 text-sm">
        
        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-green-100 text-green-700 font-semibold" : "hover:bg-gray-200"
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-green-100 text-green-700 italic" : "hover:bg-gray-200"
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-green-100 text-green-700"
              : "hover:bg-gray-200"
          }`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList")
              ? "bg-green-100 text-green-700"
              : "hover:bg-gray-200"
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>

        <button
          type="button"
          className={`px-2 py-1 rounded ${
            editor.isActive("orderedList")
              ? "bg-green-100 text-green-700"
              : "hover:bg-gray-200"
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
      </div>

      {/* ✍️ EDITOR */}
      <div className="p-3 min-h-[150px] prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}