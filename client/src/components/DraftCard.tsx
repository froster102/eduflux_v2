import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Check, X } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

interface DraftCardProps {
  onSave: (content: string, color: string) => void;
  onDiscard: () => void;
  selectedColor: string;
}

export default function DraftCard({
  onSave,
  onDiscard,
  selectedColor,
}: DraftCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [content, setContent] = React.useState("");
  const discardTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  return (
    <Card
      className={`${selectedColor} relative max-h-[224px] min-h-[224px] w-full h-full`}
      disableAnimation={true}
      onMouseEnter={() => {
        setHovered(true);
        if (discardTimeoutRef.current) {
          clearTimeout(discardTimeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        discardTimeoutRef.current = setTimeout(() => {
          setHovered(false);
          onDiscard();
        }, 1000);
      }}
    >
      <CardBody>
        <textarea
          className="bg-transparent h-full border-none outline-none scrollbar-hide"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
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
                  onPress={onDiscard}
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
              <Tooltip content="update" placement="bottom">
                <Button
                  isIconOnly
                  className="absolute bottom-2 right-2 bg-zinc-950 text-zinc-100"
                  color="primary"
                  radius="full"
                  onPress={() => {
                    onSave(content, selectedColor);
                  }}
                >
                  <Check />
                  {""}
                </Button>
              </Tooltip>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Card>
  );
}
