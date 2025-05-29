import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import React from "react";

import UserInfo from "./UserInfo";
import StudentCourses from "./StudentCourses";
import TutorCourses from "./TutorCourses";

interface ViewUserModalProps {
  role: Role;
  isOpen: boolean;
  user: User | null;
  handleModalClose: () => void;
}

export default function ViewUserModal({
  role,
  isOpen,
  user,
  handleModalClose,
}: ViewUserModalProps) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(2);

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "dark:bg-secondary-700 bg-secondary-500",
        backdrop: "bg-secondary-600/10",
      }}
      isOpen={isOpen}
      onOpenChange={handleModalClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex capitalize flex-col gap-1">
              {role}
            </ModalHeader>
            <ModalBody className="p-0 item-center justify-center px-6 pb-6">
              {user ? (
                <>
                  <UserInfo user={user} />
                  {user.role === "STUDENT" && user.student ? (
                    <StudentCourses
                      page={page}
                      pageSize={pageSize}
                      setPage={setPage}
                      setPageSize={setPageSize}
                      user={user}
                    />
                  ) : user.role === "TUTOR" ? (
                    <TutorCourses
                      page={page}
                      pageSize={pageSize}
                      setPage={setPage}
                      user={user}
                    />
                  ) : null}
                </>
              ) : (
                <p>User not available</p>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
