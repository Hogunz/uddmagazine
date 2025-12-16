import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Quote
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    label?: string;
    error?: string;
    className?: string;
}

export default function RichTextEditor({ value, onChange, label, error, className = "" }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[150px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <div className={`border rounded-md overflow-hidden bg-background ${error ? 'border-red-500' : 'border-input'}`}>
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'bg-muted' : ''}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'bg-muted' : ''}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'bg-muted' : ''}
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                    >
                        <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                    >
                        <Heading3 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                    >
                        <Quote className="w-4 h-4" />
                    </Button>
                </div>

                {/* Editor Content */}
                <EditorContent editor={editor} />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
}
