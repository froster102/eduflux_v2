import { Button } from "@heroui/button";
import { Link, useNavigate } from "react-router";
import { Divider } from "@heroui/divider";
import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Chip } from "@heroui/chip";

import { useGetAllCoursesQuery } from "@/features/admin/courses/hooks/queries";
import DataTable from "@/components/DataTable";
import { VerticalDotsIcon } from "@/components/VerticalDotsIcon";
import { useDeleteCourseMutaion } from "@/features/admin/courses/hooks/mutations";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function CoursesListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchKey] = React.useState("title");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const deleteCourseMutaion = useDeleteCourseMutaion();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null,
  );
  const { isLoading, data } = useGetAllCoursesQuery({
    page,
    pageSize,
    searchKey,
    searchQuery,
  });

  const columns = [
    { uid: "title", name: "Title" },
    { uid: "difficulty", name: "Difficulty" },
    { uid: "status", name: "Status" },
    { uid: "enrollments", name: "Enrollments" },
    { uid: "createdBy", name: "Created By" },
    { uid: "processing", name: "Processing" },
    { uid: "actions", name: "Actions" },
  ];

  const statusMap: Record<string, "success" | "danger" | "warning"> = {
    draft: "warning",
    published: "success",
  };

  const renderCell = React.useCallback((item: Course, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return <p className="capitalize">{item.title}</p>;
      case "difficulty":
        return <p className="capitalize">{item.difficulty}</p>;
      case "processing":
        return (
          <Chip
            color={item.processing ? "warning" : "success"}
            size="sm"
            variant="flat"
          >
            {item.processing ? "Pending" : "Completed"}
          </Chip>
        );
      case "enrollments":
        return <p>{item.totalEnrollments}</p>;
      case "createdBy":
        return <p>{item.createdBy}</p>;
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
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem
                  key="delete"
                  onPress={() => {
                    setSelectedCourse(item);
                    setOpenConfirmationModal(true);
                  }}
                >
                  Delete
                </DropdownItem>
                <DropdownItem key="edit">
                  <Link to={`/admin/courses/${item.id}`}>Edit</Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

  function handleDeleteCourse() {
    if (selectedCourse) {
      deleteCourseMutaion.mutate(selectedCourse.id);
    }
    setOpenConfirmationModal(false);
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Courses</p>
          <small className="text-sm text-default-500">List of courses</small>
        </div>
        <Button
          className="bg-zinc-950 text-zinc-100"
          onPress={() => navigate("/admin/courses/add")}
        >
          Add Course
        </Button>
      </div>
      <Divider className="mt-4 mb-2" orientation="horizontal" />

      <div className="gap-4 flex flex-col  sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 pt-8" />
      <DataTable
        columns={columns}
        data={data?.courses || []}
        isLoading={isLoading}
        keyProp="title"
        page={page}
        pageSize={pageSize}
        renderCell={renderCell}
        searchFilter={searchQuery}
        searchKey={searchKey}
        totalCount={data?.total ?? 0}
        onPaginationChange={setPage}
        onRowsPerPageChange={setPageSize}
        onSearchChange={setSearchQuery}
      />

      <ConfirmationModal
        boldText={`${selectedCourse && selectedCourse.title}`}
        isOpen={openConfirmationModal}
        message={`Are you sure that you want to delete`}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleDeleteCourse}
      />
    </>
  );
}
