import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { AnimatePresence } from "framer-motion";
import { Check, Pencil, X } from "lucide-react";
import React from "react";
import { motion } from "motion/react";

interface NoteCardProps {
  note: Note;
  editHandler: (id: string, content: string) => void;
  deleteHandler: (id: string) => void;
  defaultMode?: "view" | "edit";
}

export default function NoteCard({
  note,
  defaultMode,
  deleteHandler,
  editHandler,
}: NoteCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [localNoteState, setLocalNoteState] = React.useState<Note>(note);
  const [mode, setMode] = React.useState<"view" | "edit">(
    defaultMode || "view",
  );

  function handleMouseLeave() {
    setMode("view");
    const change = note.content !== localNoteState.content;

    if (change) {
      editHandler(note.id, localNoteState.content);
    }
  }

  return (
    <Card
      className={`${note.color} relative max-h-[224px] min-h-[224px] w-full h-full`}
      disableAnimation={true}
      onDoubleClick={() => {}}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        handleMouseLeave();
      }}
    >
      <CardBody className="p-6">
        {mode === "view" ? (
          <p>{note.content}</p>
        ) : (
          <textarea
            className="bg-transparent h-full border-none outline-none scrollbar-hide"
            value={localNoteState.content}
            onChange={(e) =>
              setLocalNoteState({ ...localNoteState, content: e.target.value })
            }
          />
        )}
      </CardBody>
      <AnimatePresence>
        {hovered && (
          <>
            <motion.div
              key="delete-button"
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 right-2"
              //   exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Tooltip content="delete" placement="bottom">
                <Button
                  isIconOnly
                  className="absolute top-2 right-2"
                  color="primary"
                  radius="full"
                  size="sm"
                  onPress={() => {
                    setMode("view");
                    deleteHandler(note.id);
                  }}
                >
                  <X />
                  {""}
                </Button>
              </Tooltip>
            </motion.div>

            <motion.div
              key="edit-button"
              animate={{ opacity: 1, y: 0 }}
              //   exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {mode === "view" ? (
                <Tooltip content="edit" placement="bottom">
                  <Button
                    isIconOnly
                    className="absolute bottom-2 right-2 bg-zinc-950 text-zinc-100"
                    color="primary"
                    radius="full"
                    onPress={() => {
                      setMode("edit");
                    }}
                  >
                    <Pencil />
                    {""}
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip content="update" placement="bottom">
                  <Button
                    isIconOnly
                    className="absolute bottom-2 right-2 bg-zinc-950 text-zinc-100"
                    color="primary"
                    radius="full"
                    onPress={handleMouseLeave}
                  >
                    <Check />
                    {""}
                  </Button>
                </Tooltip>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Card>
  );
}
