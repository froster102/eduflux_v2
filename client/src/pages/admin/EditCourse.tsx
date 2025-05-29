import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { addToast } from "@heroui/toast";
import { Modal, ModalBody, ModalContent } from "@heroui/modal";

import CourseForm from "@/features/admin/courses/components/CourseForm";
import { useGetCourseByIdQuery } from "@/features/admin/courses/hooks/queries";
import { useUpdateCourseMutaion } from "@/features/admin/courses/hooks/mutations";
import UploadProgress from "@/features/admin/courses/components/UploadProgress";
import { useCourseStore } from "@/store/course-store";
import { uploadImage } from "@/utils/upload";

export default function EditCoursePage() {
  const { courseId } = useParams();
  const {
    uploadProgress,
    resetUploadProgress,
    setCurrentStep,
    setCourseUploading,
    openProgressModal,
    closeProgressModal,
    updateIndividualFileProgress,
  } = useCourseStore();
  const formRef = React.useRef<HTMLFormElement>(null);
  const { data, isLoading, isError } = useGetCourseByIdQuery(courseId!);
  const updateCourseMutation = useUpdateCourseMutaion();
  const navigate = useNavigate();

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

  async function onSubmit(updateData: Partial<Course>) {
    const progessHandler = (progress: number, fileName: string) => {
      updateIndividualFileProgress(fileName, progress);
    };

    const updatedCourseData = { ...updateData, courseId };

    if (updateData.thumbnail instanceof File) {
      try {
        setCurrentStep("uploading_image");
        openProgressModal();
        const fileUrl = await uploadImage(updateData.thumbnail, progessHandler);

        updatedCourseData.thumbnail = fileUrl;
      } catch {
        addToast({
          title: "Image upload",
          description: "Failed to upload image",
          color: "danger",
        });
      }
    }
    updateCourseMutation.mutate(updatedCourseData as Course);
    setTimeout(() => {
      resetUploadProgress();
      closeProgressModal();
      setCourseUploading(false);
    }, 2000);
  }

  if (isError) {
    return (
      <div>
        <Modal
          defaultOpen
          backdrop="blur"
          classNames={{
            base: "bg-secondary",
          }}
          hideCloseButton={true}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {() => (
              <ModalBody className="p-6">
                <p className="text-lg font-medium">
                  This course has been not being found, It might be deleted or
                  temporarily unavailable
                </p>
                <Button
                  color="primary"
                  onPress={() => {
                    navigate("/admin/enrollments");
                  }}
                >
                  Back to enrollments
                </Button>
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">Course Setup</p>
          <small className="text-default-500 text-sm">
            Please fill the following fields to update your course
          </small>
        </div>
        <Button
          className="bg-zinc-950 text-zinc-100"
          isLoading={uploadProgress.isUploading}
          onPress={() => {
            formRef.current?.requestSubmit();
          }}
        >
          Update
          <PlusIcon />
        </Button>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <CourseForm
          ref={formRef}
          initialValues={data}
          isEditing={true}
          onSubmitHandler={onSubmit}
        />
      )}
      {uploadProgress.isProgressModalOpen && <UploadProgress />}
    </>
  );
}
