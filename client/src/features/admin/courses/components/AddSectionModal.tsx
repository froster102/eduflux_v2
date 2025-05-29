import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Form } from "@heroui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { sectionSchema } from "../validation/course-schema";

import { useCourseStore } from "@/store/course-store";
import { nanoid } from "@/utils/nanoid";

interface SectionFormData {
  title: string;
  description: string;
}

export default function AddSectionModal({ isOpen }: { isOpen: boolean }) {
  const { closeSectionModal, courseEditor, addSection, updateSection } =
    useCourseStore();
  const formRef = React.useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: courseEditor.selectedSection || {},
  });

  const onSubmit: SubmitHandler<SectionFormData> = (sectionFormData) => {
    if (courseEditor.selectedSection) {
      updateSection(courseEditor.selectedSection.id, {
        ...courseEditor.selectedSection,
        ...sectionFormData,
      });
      reset();
      closeSectionModal();

      return;
    }
    addSection({
      ...sectionFormData,
      id: nanoid(10),
      lessons: [],
    });
    reset();
    closeSectionModal();

    return;
  };

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
        onClose={() => reset()}
        onOpenChange={() => closeSectionModal()}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {courseEditor.selectedSection
                  ? "Update Section"
                  : "Add section"}
              </ModalHeader>
              <ModalBody>
                <Form
                  ref={formRef}
                  className="pt-0"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    {...register("title")}
                    errorMessage={errors.title?.message}
                    isInvalid={!!errors.title}
                    label="Title"
                    labelPlacement="outside"
                    name="title"
                    placeholder="Enter your section title"
                    type="text"
                  />
                  <Textarea
                    {...register("description")}
                    errorMessage={errors.description?.message}
                    isInvalid={!!errors.description}
                    label="Description"
                    labelPlacement="outside"
                    name="description"
                    placeholder="Enter your section title"
                    type="text"
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
                    formRef.current?.requestSubmit();
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
