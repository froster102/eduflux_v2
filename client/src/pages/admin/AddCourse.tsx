import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { PlusIcon } from "lucide-react";
import React from "react";
import { addToast } from "@heroui/toast";
import { useNavigate } from "react-router";

import CourseForm from "@/features/admin/courses/components/CourseForm";
import { useCourseStore } from "@/store/course-store";
import { uploadImage } from "@/utils/upload";
import { useAddCourseMutaion } from "@/features/admin/courses/hooks/mutations";
import UploadProgress from "@/features/admin/courses/components/UploadProgress";

export default function AddCoursePage() {
  const {
    updateIndividualFileProgress,
    resetUploadProgress,
    closeProgressModal,
    openProgressModal,
    setCourseUploading,
    setCurrentStep,
    uploadProgress,
  } = useCourseStore();
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const addCourseMutation = useAddCourseMutaion(navigate);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      if (uploadProgress.isUploading) {
        resetUploadProgress();
        closeProgressModal();
        setCourseUploading(false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadProgress.isUploading]);

  const onSubmit = async (
    courseData: Omit<Course, "createdBy" | "processing">,
  ) => {
    if (!uploadProgress.isUploading) {
      setCourseUploading(true);
    }
    const progessHandler = (progress: number, fileName: string) => {
      updateIndividualFileProgress(fileName, progress);
    };

    if (courseData.thumbnail instanceof File) {
      try {
        setCurrentStep("uploading_image");
        openProgressModal();
        const fileUrl = await uploadImage(courseData.thumbnail, progessHandler);

        courseData.thumbnail = fileUrl;
      } catch {
        addToast({
          title: "Thumbnail image upload failed",
          description: "Failed to upload thumbnail image",
        });
      }
    }
    addCourseMutation.mutate(courseData);
    setTimeout(() => {
      resetUploadProgress();
      closeProgressModal();
      setCourseUploading(false);
    }, 2000);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">Course Setup</p>
          <small className="text-default-500 text-sm">
            Please fill the following fields to add your course
          </small>
        </div>
        <Button
          className="bg-zinc-950 text-zinc-100"
          isLoading={uploadProgress.isUploading}
          onPress={() => {
            formRef.current?.requestSubmit();
          }}
        >
          Add
          <PlusIcon />
        </Button>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <CourseForm ref={formRef} onSubmitHandler={onSubmit} />
      {uploadProgress.isProgressModalOpen && <UploadProgress />}
    </>
  );
}
