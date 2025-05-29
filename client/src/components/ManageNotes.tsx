/* eslint-disable @typescript-eslint/no-unused-vars */
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { PlusIcon, Search } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@heroui/input";

import NoteCard from "@/components/NoteCard";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "@/features/notes/hooks/mutations";
import { useGetNotesQuery } from "@/features/notes/hooks/queries";
import DraftCard from "@/components/DraftCard";

export default function ManageNotes() {
  const [draftNote, setDraftNote] = React.useState<{
    content: string;
    color: string;
  } | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page] = React.useState(1);
  const [pageSize] = React.useState(5);
  const { data, isLoading } = useGetNotesQuery({ page, pageSize, searchQuery });
  const addNoteMutation = useAddNoteMutation({
    page,
    pageSize,
    searchQuery,
  });
  const updateNoteMutation = useUpdateNoteMutation({
    page,
    pageSize,
    searchQuery,
  });
  const deleteNoteMutation = useDeleteNoteMutation({
    page,
    pageSize,
    searchQuery,
  });

  const COLORS = [
    { name: "Red", bg: "bg-red-500", text: "text-white", value: "red" },
    {
      name: "Orange",
      bg: "bg-orange-500",
      text: "text-white",
      value: "orange",
    },
    {
      name: "Yellow",
      bg: "bg-yellow-400",
      text: "text-black",
      value: "yellow",
    },
    { name: "Green", bg: "bg-green-500", text: "text-white", value: "green" },
    { name: "Blue", bg: "bg-blue-500", text: "text-white", value: "blue" },
    {
      name: "Purple",
      bg: "bg-purple-500",
      text: "text-white",
      value: "purple",
    },
  ];

  function handleDeleteNote(id: string) {
    deleteNoteMutation.mutate(id);
  }

  function handleEditNote(id: string, content: string) {
    updateNoteMutation.mutate({ content, id });
  }

  function handleAddNote(content: string, color: string) {
    setDraftNote({ content, color });
    addNoteMutation.mutate({ content, color });
    setDraftNote(null);
  }

  return (
    <>
      <div className="flex-row md:flex-col gap-6 justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Notes</p>
          <small className="text-sm text-default-500">
            Below are the list of your personal notes
          </small>
        </div>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <div className="pt-4">
        <Input
          placeholder="Search for your notes"
          startContent={
            <Search className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full pt-6 gap-4">
        <div className="absolute top-5 right-5 md:static z-50 items-center">
          <Button
            isIconOnly
            color="primary"
            radius="full"
            onPress={() => setIsOpen(!isOpen)}
          >
            <PlusIcon />{" "}
          </Button>
          <AnimatePresence>
            {isOpen && (
              <div className="flex-col items-center">
                {COLORS.map((color, index) => (
                  <motion.div
                    key={color.value}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    aria-label={`Select ${color.name} color`}
                    className="flex items-center pt-2"
                    exit={{
                      y: -10,
                      opacity: 0,
                      transition: {
                        delay: index * 0.05,
                        duration: 0.2,
                      },
                    }}
                    initial={{ y: -20, opacity: 0 }}
                  >
                    <Button
                      isIconOnly
                      className={`${color.bg}`}
                      radius="full"
                      onPress={() => {
                        setDraftNote({ color: color.bg, content: "" });
                        setIsOpen(false);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
        <div className="gap-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
          <AnimatePresence>
            {draftNote && (
              <motion.div
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                aria-label={`Add note`}
                exit={{
                  y: -10,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                  },
                }}
                initial={{ y: -20, opacity: 0 }}
              >
                <DraftCard
                  selectedColor={draftNote.color}
                  onDiscard={() => {
                    setDraftNote(null);
                    // addToast({
                    //   title: "Unsaved Note Discarded",
                    //   description:
                    //     "This note was removed since it wasn’t saved. Add content and save next time to keep it.",
                    //   color: "warning",
                    // });
                  }}
                  onSave={handleAddNote}
                />
              </motion.div>
            )}
            {isLoading ? (
              <p>Loading..</p>
            ) : (
              (data?.notes || []).map((note, index) => (
                <motion.div
                  key={note.id}
                  layout
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: index * 0.04,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  className="h-full w-full"
                  exit={{
                    y: -10,
                    opacity: 0,
                  }}
                  initial={{ y: -20, opacity: 0 }}
                >
                  <NoteCard
                    key={index}
                    deleteHandler={handleDeleteNote}
                    editHandler={handleEditNote}
                    note={note}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
