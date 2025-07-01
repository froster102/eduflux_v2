import { Icon } from "@iconify/react";
import { Editor } from "@tiptap/react";
import { Button, ButtonGroup } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-default-200 p-2 flex flex-wrap gap-2">
      <ButtonGroup>
        <Tooltip className="text-xs" content="Bold" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("bold") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleBold().run()}
          >
            <Icon icon="lucide:bold" />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Italic" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("italic") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleItalic().run()}
          >
            <Icon icon="lucide:italic" />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Underline" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("underline") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Icon icon="lucide:underline" />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup>
        <Tooltip className="text-xs" content="Bullet list" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("bulletList") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleBulletList().run()}
          >
            <Icon icon="lucide:list" />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Ordered list" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("orderedList") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <Icon icon="lucide:list-ordered" />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup>
        <Tooltip className="text-xs" content="Align left" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive({ textAlign: "left" }) ? "solid" : "flat"}
            onPress={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <Icon icon="lucide:align-left" />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Align center" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={
              editor.isActive({ textAlign: "center" }) ? "solid" : "flat"
            }
            onPress={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <Icon icon="lucide:align-center" />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Align right" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive({ textAlign: "right" }) ? "solid" : "flat"}
            onPress={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <Icon icon="lucide:align-right" />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
}
