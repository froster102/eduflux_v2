import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@heroui/switch";
import { Info } from "lucide-react";
import { nanoid } from "nanoid";

import { lessonSchema } from "../validation/course-schema";

import ResourcePreview from "./ResourcePreview";

import { useCourseStore } from "@/store/course-store";

interface LessonFormData {
  description: string;
  title: string;
  video: string | File;
  preview: boolean;
}

export default function AddLessonModal({
  isOpen,
}: {
  isOpen: boolean;
  isEditing?: boolean;
}) {
  const { closeLessonModal, courseEditor, addLesson, updateLesson } =
    useCourseStore();
  const {
    register,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: courseEditor.selectedLesson || {},
  });
  const lessonFormRef = React.useRef<HTMLFormElement>(null);

  const onSubmit: SubmitHandler<LessonFormData> = (lessonFormData) => {
    const { selectedSection, selectedLesson } = courseEditor;

    if (selectedSection && selectedLesson) {
      updateLesson(selectedSection.id, selectedLesson.id, lessonFormData);
      reset();
      closeLessonModal();

      return;
    }
    if (selectedSection) {
      addLesson(selectedSection.id, {
        ...lessonFormData,
        id: nanoid(10),
      });
      reset();
      closeLessonModal();

      return;
    }
  };

  const watchedVideo = watch("video");

  return (
    <>
      <Modal
        backdrop="blur"
        className="dark:bg-secondary-700 bg-secondary-400"
        classNames={{
          backdrop: "bg-secondary-600/10",
        }}
        isOpen={isOpen}
        placement="top-center"
        scrollBehavior="inside"
        size="4xl"
        onClose={() => reset()}
        onOpenChange={() => closeLessonModal()}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {courseEditor.selectedLesson ? "Update Lesson" : "Add Lesson"}
              </ModalHeader>
              <ModalBody>
                <Form
                  ref={lessonFormRef}
                  className="pt-0 flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    {...register("title")}
                    errorMessage={errors.title?.message}
                    isInvalid={!!errors.title}
                    label="Title"
                    labelPlacement="outside"
                    name="title"
                    placeholder="Enter your lesson title"
                    type="text"
                  />

                  <Textarea
                    {...register("description")}
                    errorMessage={errors.description?.message}
                    isInvalid={!!errors.description}
                    label="Description"
                    labelPlacement="outside"
                    name="description"
                    placeholder="Enter your lesson description"
                    type="text"
                  />
                  <Controller
                    control={control}
                    name="video"
                    render={({ field }) => (
                      <Input
                        accept="video/*"
                        errorMessage={errors.video?.message}
                        isInvalid={!!errors.video?.message}
                        label="Lesson Video"
                        labelPlacement="outside"
                        placeholder="Upload lesson video file"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />
                    )}
                  />
                  <ResourcePreview resourceType="video" src={watchedVideo} />
                  <Controller
                    control={control}
                    name="preview"
                    render={({ field }) => (
                      <>
                        <Switch
                          color="default"
                          defaultSelected={false}
                          isSelected={field.value || false}
                          onValueChange={(v) => {
                            field.onChange(v);
                          }}
                        >
                          <span className="flex gap-2 text-sm items-center">
                            <Info />
                            Toggle this button to make the lesson free for
                            preview
                          </span>
                        </Switch>
                        {errors.preview && (
                          <small className="text-red-600 text-xs p-0">
                            {errors.preview?.message}
                          </small>
                        )}
                      </>
                    )}
                  />

                  <div className="flex py-2 px-1 justify-between" />
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    lessonFormRef.current?.requestSubmit();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
