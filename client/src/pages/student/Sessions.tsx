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
import { useNavigate } from "react-router";

import { useGetStudentSessionQuery } from "@/features/hooks/queries";
import DataTable from "@/components/DataTable";
import { VerticalDotsIcon } from "@/components/VerticalDotsIcon";
import { formatTo12HourWithDate } from "@/utils/date";

export default function SessionsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchKey] = React.useState("email");
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(5);
  const { data, isLoading } = useGetStudentSessionQuery({
    page,
    pageSize,
    searchKey,
    searchQuery,
  });

  const sessionColumns = [
    { uid: "startTime", name: "Start Time" },
    { uid: "endTime", name: "End Time" },
    { uid: "tutor", name: "Tutor" },
    { uid: "status", name: "Status" },
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
        case "tutor":
          return (
            <p className="capitalize">
              {session?.tutor.firstName + " " + session.student.lastName}
            </p>
          );
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
                  ]}
                >
                  <DropdownItem
                    key="join"
                    onPress={() => {
                      navigate(`/sessions/${session.id}`);
                    }}
                  >
                    Join
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

  return (
    <>
      <div className="flex-row md:flex-col gap-6 justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Sessions</p>
          <small className="text-sm text-default-500">
            Below are the list of session scheduled for you
          </small>
        </div>
      </div>
      <Divider className="my-4" orientation="horizontal" />
      <div className="pt-4">
        <DataTable
          columns={sessionColumns}
          data={data?.sessions || []}
          isLoading={isLoading}
          keyProp={""}
          page={page}
          pageSize={pageSize}
          renderCell={sessionTableRenderCell}
          searchFilter=""
          searchKey={""}
          totalCount={data?.totalCount ?? 0}
          onPaginationChange={setPage}
          onRowsPerPageChange={setPage}
          onSearchChange={setSearchQuery}
        />
      </div>
    </>
  );
}
