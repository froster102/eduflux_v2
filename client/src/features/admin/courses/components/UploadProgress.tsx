import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Progress } from "@heroui/progress";

import { useCourseStore } from "@/store/course-store";

export default function UploadProgress() {
  const { uploadProgress, closeProgressModal } = useCourseStore();

  return (
    <Modal
      backdrop="blur"
      className="bg-background"
      closeButton={<></>}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={uploadProgress.isProgressModalOpen}
      onOpenChange={() => {
        closeProgressModal();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Upload Progress
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium">Current Step</p>
              <p className="text-sm text-default-500 capitalize">
                {uploadProgress.currentStep.replace("_", " ")}
              </p>
            </div>
            {uploadProgress.currentStep !== "uploading_image" && (
              <div>
                <p className="text-sm font-medium">Total Progress</p>
                <Progress
                  aria-label="Uploading..."
                  className="max-w-md"
                  label="Uploading..."
                  showValueLabel={true}
                  value={uploadProgress.totalProgress}
                />
                <p className="text-sm text-default-500">
                  {uploadProgress.totalProgress}% Complete
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Individual File Progress</p>
              <div className="flex flex-col gap-2">
                {uploadProgress.individualFileProgress.map((file, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <p className="text-sm">{file.fileName}</p>
                    <Progress
                      aria-label="Uploading..."
                      className="max-w-md"
                      label="Uploading..."
                      value={file.progress}
                    />
                    <p className="text-sm text-default-500">
                      {file.progress}% Complete
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
