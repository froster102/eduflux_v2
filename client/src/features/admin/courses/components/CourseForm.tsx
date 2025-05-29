import { Input, Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Select, SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCourseSchema } from "../validation/course-schema";

import DroppableSections from "./DroppableSections";
import ResourcePreview from "./ResourcePreview";

import { useCourseStore } from "@/store/course-store";
import { updateSectionsWithFileUrls } from "@/utils/upload";

interface CourseFormProps {
  initialValues?: Course;
  onSubmitHandler: (data: Omit<Course, "createdBy" | "processing">) => void;
  isEditing?: boolean;
}

export interface CourseFormData {
  title: string;
  status: "published" | "draft";
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string | File;
}

const CourseForm = React.forwardRef<HTMLFormElement, CourseFormProps>(
  ({ initialValues, isEditing, onSubmitHandler }, ref) => {
    const {
      setSections,
      courseEditor,
      setCourseUploading,
      setTotalFiles,
      openProgressModal,
      setTotalProgress,
      updateIndividualFileProgress,
    } = useCourseStore();
    const {
      register,
      handleSubmit,
      control,
      reset,
      watch,
      formState: { errors },
    } = useForm<CourseFormData>({
      defaultValues: initialValues,
      resolver: zodResolver(createCourseSchema),
    });

    React.useEffect(() => {
      if (isEditing && initialValues?.sections) {
        setSections(initialValues.sections);
        reset(initialValues);
      } else {
        setSections([]);
      }
    }, []);

    const onSubmit: SubmitHandler<CourseFormData> = async (courseFormData) => {
      const totalProgressHandler = (progress: number) => {
        setTotalProgress(progress);
      };

      const individualProgressHandler = (
        progress: number,
        fileName: string,
      ) => {
        updateIndividualFileProgress(fileName, progress);
      };
      const sections = [...courseEditor.sections];

      let totalFiles = 0;

      sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          if (lesson.video instanceof File) {
            totalFiles++;
          }
        });
      });
      if (totalFiles > 0) {
        setCourseUploading(true);
        openProgressModal();
        setTotalFiles(totalFiles);
      }

      const updatedSections = await updateSectionsWithFileUrls(
        sections,
        totalProgressHandler,
        individualProgressHandler,
      );

      setSections(updatedSections);

      onSubmitHandler({
        ...courseFormData,
        sections: updatedSections,
        id: isEditing && initialValues?.id ? initialValues.id : "",
      });
    };

    return (
      <>
        <div className="flex justify-between w-full h-full gap-4 p-4">
          <Form
            ref={ref}
            className="pt-6 h-full w-full min-w-[224px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full ">
              <Input
                {...register("title")}
                errorMessage={errors.title?.message}
                isInvalid={!!errors.title}
                label="Title"
                labelPlacement="outside"
                name="title"
                placeholder="Enter your course title"
                type="text"
              />

              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Select
                    className="pt-4"
                    errorMessage={errors.difficulty?.message}
                    isInvalid={!!errors.difficulty}
                    label="Difficulty"
                    labelPlacement="outside"
                    placeholder="Select difficulty of the course"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(value) => {
                      field.onChange(value.anchorKey);
                    }}
                  >
                    <SelectItem key={"beginner"}>Beginner</SelectItem>
                    <SelectItem key={"intermediate"}>Intermediate</SelectItem>
                    <SelectItem key={"advanced"}>Advanced</SelectItem>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    className="pt-4"
                    errorMessage={errors.status?.message}
                    isInvalid={!!errors.status}
                    label="Status"
                    labelPlacement="outside"
                    placeholder="Select status of the course"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(value) => {
                      field.onChange(value.anchorKey);
                    }}
                  >
                    <SelectItem key={"published"}>Published</SelectItem>
                    <SelectItem key={"draft"}>Draft</SelectItem>
                  </Select>
                )}
              />
              <Textarea
                {...register("description")}
                className="pt-4"
                disableAutosize={false}
                errorMessage={errors.description?.message}
                isInvalid={!!errors.description}
                label="Description"
                labelPlacement="outside"
                placeholder="Enter your description"
              />
            </div>
            <div>
              <Controller
                control={control}
                name={"thumbnail"}
                render={({ field }) => (
                  <Input
                    accept="image/jpeg, image/jpg, image/png"
                    className="pt-4"
                    errorMessage={errors.thumbnail?.message}
                    isInvalid={!!errors.thumbnail}
                    label="Thumbnail"
                    labelPlacement="outside"
                    name="thumbnail"
                    placeholder="Choose your course thumbnail image"
                    type="file"
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                    }}
                  />
                )}
              />
              <div className="pt-4">
                <ResourcePreview
                  resourceType="image"
                  src={watch("thumbnail")}
                />
              </div>
            </div>
          </Form>
          <div className="pt-4 w-full">
            <DroppableSections />
          </div>
        </div>
      </>
    );
  },
);

CourseForm.displayName = "CourseForm";

export default CourseForm;
