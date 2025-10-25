import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';

import Toolbar from './toolbar';

export default function RichTextEditor({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextStyle,
      TextAlign.configure({
        types: ['paragraph'],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose max-w-full focus:outline-none w-full p-2 h-[224px] overflow-y-scroll scrollbar-hide bg-default-100 dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      onValueChange(editor.getHTML());
    },
  });

  return (
    <div className="shadow-sm rounded-medium overflow-hidden w-full">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
