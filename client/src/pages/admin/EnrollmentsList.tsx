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
import { Link } from "react-router";

import { useGetAllEnrollmentsQuery } from "@/features/admin/enrollments/hooks/queries";
import DataTable from "@/components/DataTable";
import { VerticalDotsIcon } from "@/components/VerticalDotsIcon";
import { formatTo12HourWithDate } from "@/utils/date";
import ConfirmationModal from "@/components/ConfirmationModal";
import {
  useApproveEnrollmentMutation,
  useRejectEnrollmentMutation,
} from "@/features/admin/enrollments/hooks/mutations";

export default function EnrollmentsListPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchKey] = React.useState("email");
  const approveEnrollmentMutation = useApproveEnrollmentMutation();
  const rejectEnrollmentMutation = useRejectEnrollmentMutation();
  const [selectedEnrollment, setSelectedEnrollment] =
    React.useState<Enrollment | null>(null);
  const [page, setPage] = React.useState(1);
  const [action, setAction] = React.useState<"approve" | "reject">("approve");
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(5);
  const { data, isFetching } = useGetAllEnrollmentsQuery({
    searchKey,
    searchQuery,
    page,
    pageSize,
  });

  const statusMap: Record<string, "warning" | "success" | "danger"> = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  const columns = [
    { uid: "studentId", name: "Student ID" },
    { uid: "requestedAt", name: "Requested At" },
    { uid: "status", name: "Status" },
    { uid: "courseId", name: "Course Id" },
    { uid: "reviewedBy", name: "Reviewer" },
    { uid: "reviewedAt", name: "Reviewed At" },
    { uid: "actions", name: "Actions" },
  ];

  const renderCell = React.useCallback(
    (item: Enrollment, columnKey: string) => {
      switch (columnKey) {
        case "studentId":
          return <p>{item.studentId}</p>;
        case "requestedAt":
          return <p>{formatTo12HourWithDate(new Date(item.requestedAt))}</p>;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusMap[item.status]}
              size="sm"
              variant="flat"
            >
              {item.status}
            </Chip>
          );

        case "courseId":
          return (
            <Link
              className="text-blue-600"
              to={`/admin/courses/${item.courseId}`}
            >
              {item.courseId}
            </Link>
          );
        case "reviewedBy":
          return <p>{item.reviewedBy}</p>;
        case "reviewedAt":
          return (
            <p className="font-semibold">
              {item.reviewedAt
                ? formatTo12HourWithDate(new Date(item.reviewedAt))
                : "NOT REVIEWED"}
            </p>
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
                  disabledKeys={
                    item.status === "approved" || item.status === "rejected"
                      ? ["approve", "reject"]
                      : []
                  }
                >
                  <DropdownItem key="view">View</DropdownItem>
                  <DropdownItem
                    key="approve"
                    color="success"
                    variant="flat"
                    onPress={() => {
                      setAction("approve");
                      setSelectedEnrollment(item);
                      setOpenConfirmModal(true);
                    }}
                  >
                    Approve
                  </DropdownItem>
                  <DropdownItem
                    key="reject"
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      setAction("reject");
                      setSelectedEnrollment(item);
                      setOpenConfirmModal(true);
                    }}
                  >
                    Reject
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

  function handleApproveEnrollment(enrollmentId: string) {
    approveEnrollmentMutation.mutate(enrollmentId);
    setOpenConfirmModal(false);
  }

  function handleRejectEnrollment(enrollmentId: string) {
    rejectEnrollmentMutation.mutate(enrollmentId);
    setOpenConfirmModal(false);
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">Enrollments</p>
          <small className="text-default-500 text-sm">
            Below are the course enrollment requests
          </small>
        </div>
      </div>
      <Divider className="mt-4 mb-4" orientation="horizontal" />
      <DataTable
        columns={columns}
        data={data?.enrollments || []}
        isLoading={isFetching}
        keyProp={"enrollmentId"}
        page={page}
        pageSize={pageSize}
        renderCell={renderCell}
        searchFilter={searchQuery}
        searchKey={searchKey}
        totalCount={data?.totalCount ?? 0}
        onPaginationChange={setPage}
        onRowsPerPageChange={setPageSize}
        onSearchChange={setSearchQuery}
      />
      <ConfirmationModal
        confirmText={action}
        isOpen={openConfirmModal}
        message={`Are you sure that you want to ${action} the enrollment`}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={
          action === "approve"
            ? () => {
                selectedEnrollment &&
                  handleApproveEnrollment(selectedEnrollment.id);
              }
            : () => {
                selectedEnrollment &&
                  handleRejectEnrollment(selectedEnrollment.id);
              }
        }
      />
    </>
  );
}
