import { Editor } from "@tiptap/react";
import { Button, ButtonGroup } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";

import BoldIcon from "@/assets/icons/BoldIcon";

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
            <BoldIcon width={20} />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Italic" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("italic") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic width={20} />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Underline" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("underline") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline width={20} />
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
            <List width={20} />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Ordered list" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive("orderedList") ? "solid" : "flat"}
            onPress={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered width={20} />
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
            <AlignLeft width={20} />
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
            <AlignCenter width={20} />
          </Button>
        </Tooltip>
        <Tooltip className="text-xs" content="Align right" placement="bottom">
          <Button
            isIconOnly
            size="sm"
            variant={editor.isActive({ textAlign: "right" }) ? "solid" : "flat"}
            onPress={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight width={20} />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
}
