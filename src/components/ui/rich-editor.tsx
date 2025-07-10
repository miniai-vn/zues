"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';

interface RichEditorProps {
  content?: string;
  editable?: boolean;
  className?: string;
  onChange?: (content: string) => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  content = '',
  editable = false,
  className,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
          className
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {editable && (
        <div className="border-b border-gray-200 mb-4 pb-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                'px-3 py-1 text-sm border rounded',
                editor.isActive('bold') ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'
              )}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                'px-3 py-1 text-sm border rounded',
                editor.isActive('italic') ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'
              )}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                'px-3 py-1 text-sm border rounded',
                editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'
              )}
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                'px-3 py-1 text-sm border rounded',
                editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'
              )}
            >
              H2
            </button>
          </div>
        </div>
      )}
      <EditorContent 
        editor={editor} 
        className={cn(
          "min-h-[200px] p-4 border border-gray-200 rounded-md",
          !editable && "bg-gray-50"
        )} 
      />
    </div>
  );
};

export default RichEditor;
