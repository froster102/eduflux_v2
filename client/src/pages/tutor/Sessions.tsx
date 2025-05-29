import { Divider } from "@heroui/divider";
import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Card, CardBody } from "@heroui/card";
import { useNavigate } from "react-router";

import { VerticalDotsIcon } from "@/components/VerticalDotsIcon";
import DataTable from "@/components/DataTable";
import { useGetStudentSessionQuery } from "@/features/hooks/queries";
import SessionForm from "@/features/instructor/sessions/components/SessionForm";
import { useGetEnrolledStudentsQuery } from "@/features/instructor/hooks/queries";
import { EyeIcon } from "@/components/EyeIcon";
import { convertToUTC, formatTo12HourWithDate } from "@/utils/date";
import { useCreateStudentSessionMutation } from "@/features/instructor/hooks/mutations";
import { CreateSessionFormData } from "@/features/instructor/types/types";
import {
  useCancelSessionMutaion,
  useMarkStudentSessionAsCompleteMutation,
} from "@/features/hooks/mutations";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function SessionsPage() {
  const navigate = useNavigate();

  const [studentSearchQuery, setStudentSearchQuery] = React.useState("");
  const [studentSearchKey] = React.useState("email");
  const [studentPage, setStudentPage] = React.useState(1);
  const [studentPageSize, setStudentPageSize] = React.useState(10);
  const [sessionSearchQuery, setSessionSearchQuery] = React.useState("");
  const [sessionSearchKey] = React.useState("email");
  const [sessionPage, setSessionPage] = React.useState(1);
  const [sessionPageSize, setSessionPageSize] = React.useState(5);
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const [selectedSession, setSelectedSession] =
    React.useState<StudentSession | null>(null);
  const { data: enrolledStudents, isLoading: isEnrolledStudentLoading } =
    useGetEnrolledStudentsQuery({
      page: studentPage,
      pageSize: studentPageSize,
      searchKey: studentSearchKey,
      searchQuery: studentSearchQuery,
    });
  const { data: studentSessions, isLoading: isStudentSessionLoading } =
    useGetStudentSessionQuery({
      page: sessionPage,
      pageSize: sessionPageSize,
      searchKey: sessionSearchKey,
      searchQuery: sessionSearchQuery,
    });
  const createStudentSessionMutation = useCreateStudentSessionMutation({
    page: sessionPage,
    pageSize: sessionPageSize,
    searchKey: sessionSearchKey,
    searchQuery: sessionSearchQuery,
  });
  const cancelSessionMutaion = useCancelSessionMutaion({
    page: sessionPage,
    pageSize: sessionPageSize,
    searchKey: sessionSearchKey,
    searchQuery: sessionSearchQuery,
  });
  const markSessionAsCompleteMutation = useMarkStudentSessionAsCompleteMutation(
    {
      page: sessionPage,
      pageSize: sessionPageSize,
      searchKey: sessionSearchKey,
      searchQuery: sessionSearchQuery,
    },
  );

  const sessionColumns = [
    { uid: "startTime", name: "Start Time" },
    { uid: "endTime", name: "End Time" },
    { uid: "studentName", name: "Student" },
    { uid: "studentEmail", name: "Student Email" },
    { uid: "status", name: "Status" },
    { uid: "actions", name: "Actions" },
  ];

  const studentColumns = [
    { uid: "id", name: "Id" },
    { uid: "firstName", name: "First Name" },
    { uid: "lastName", name: "Last Name" },
    { uid: "email", name: "Email" },
    { uid: "actions", name: "Actions" },
  ];

  const statusMap: Record<
    StudentSession["status"],
    "success" | "warning" | "danger"
  > = {
    scheduled: "success",
    in_progress: "warning",
    completed: "success",
    failed: "danger",
    cancelled: "danger",
  };

  const studentTableRenderCell = React.useCallback(
    (student: Student, columnKey: string) => {
      switch (columnKey) {
        case "id":
          return <p>{student.id}</p>;
        case "firstName":
          return <p className="capitalize">{student.user?.firstName}</p>;
        case "lastName":
          return <p className="capitalize">{student.user?.lastName}</p>;
        case "email":
          return <p> {student.user?.email}</p>;
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="Details">
                <Chip variant="flat">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Chip>
              </Tooltip>
            </div>
          );
      }
    },
    [],
  );

  const sessionTableRenderCell = React.useCallback(
    (session: StudentSession, columnKey: string) => {
      switch (columnKey) {
        case "startTime":
          return (
            <p className="w-fit">
              {formatTo12HourWithDate(new Date(session.startTime))}
            </p>
          );
        case "endTime":
          return (
            <p className="capitalize">
              {formatTo12HourWithDate(new Date(session.endTime))}
            </p>
          );
        case "studentName":
          return (
            <p className="capitalize">
              {session?.student.firstName + " " + session.student.lastName}
            </p>
          );
        case "studentEmail":
          return <p className="capitalize">{session?.student.email}</p>;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusMap[session.status]}
              size="sm"
              variant="flat"
            >
              {session.status.replace("_", " ")}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disabledKeys={[
                    (session.status !== "scheduled" &&
                      session.status !== "in_progress") ||
                    new Date(session.startTime) > new Date() ||
                    new Date(session.endTime) < new Date()
                      ? "join"
                      : "",
                    new Date(session.endTime) < new Date() ||
                    session.status !== "scheduled"
                      ? "cancel"
                      : "",
                    session.status !== "in_progress" ? "markAsComplete" : "",
                  ]}
                >
                  <DropdownItem
                    key="join"
                    onPress={() => {
                      navigate(`/tutor/sessions/${session.id}`);
                    }}
                  >
                    Join
                  </DropdownItem>
                  <DropdownItem
                    key="markAsComplete"
                    onPress={() => {
                      markSessionAsCompleteMutation.mutate(session.id);
                    }}
                  >
                    Mark as complete
                  </DropdownItem>
                  <DropdownItem
                    key="cancel"
                    onPress={() => {
                      setSelectedSession(session);
                      setOpenConfirmationModal(true);
                    }}
                  >
                    Cancel
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    },
    [],
  );

  const onSessionFormSubmit = (formData: CreateSessionFormData) => {
    const { selectedDate, startTime, endTime, studentId } = formData;

    const startDateTime = convertToUTC(selectedDate.split("T")[0], startTime);

    const endDateTime = convertToUTC(selectedDate.split("T")[0], endTime);

    const sessionPayload = {
      startTime: startDateTime,
      endTime: endDateTime,
      studentId: studentId,
    };

    createStudentSessionMutation.mutate(sessionPayload);
  };

  function handleCancelSession(sessionId: string) {
    cancelSessionMutaion.mutate(sessionId);
    setOpenConfirmationModal(false);
  }

  // function handleJoinSession(session: StudentSession) {
  //   if (new Date() < new Date(session.startTime)) {
  //     addToast
  //   }
  // }

  return (
    <>
      <div className="flex-row md:flex-col gap-6 justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Sessions</p>
          <small className="text-sm text-default-500">
            Below are is page to list and manage sessions for students
          </small>
        </div>
      </div>
      <Divider className="my-4" orientation="horizontal" />
      <div className="flex flex-col md:flex-row gap-4 h-fit">
        <Card className="bg-background max-w-xl w-full p-2">
          <CardBody>
            <SessionForm
              isStudentLoading={isEnrolledStudentLoading}
              students={enrolledStudents?.students || []}
              onSubmitHandler={onSessionFormSubmit}
            />
          </CardBody>
        </Card>
        <DataTable
          columns={studentColumns}
          data={enrolledStudents?.students || []}
          keyProp={""}
          page={studentPage}
          pageSize={studentPageSize}
          renderCell={studentTableRenderCell}
          searchFilter=""
          searchKey={""}
          totalCount={enrolledStudents?.totalCount ?? 0}
          onPaginationChange={setStudentPage}
          onRowsPerPageChange={setStudentPageSize}
          onSearchChange={setStudentSearchQuery}
        />
      </div>
      <div className="pt-4">
        <DataTable
          columns={sessionColumns}
          data={studentSessions?.sessions || []}
          isLoading={isStudentSessionLoading}
          keyProp={""}
          page={sessionPage}
          pageSize={sessionPageSize}
          renderCell={sessionTableRenderCell}
          searchFilter=""
          searchKey={""}
          totalCount={studentSessions?.totalCount ?? 0}
          onPaginationChange={setSessionPage}
          onRowsPerPageChange={setSessionPageSize}
          onSearchChange={setSessionSearchQuery}
        />
      </div>
      <ConfirmationModal
        isOpen={openConfirmationModal}
        loading={cancelSessionMutaion.isPending}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={() =>
          selectedSession && handleCancelSession(selectedSession.id)
        }
      />
    </>
  );
}
