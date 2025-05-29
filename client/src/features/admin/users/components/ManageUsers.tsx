import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React from "react";

import {
  useBlockUserMutaion,
  useUnblockUserMutation,
} from "../hooks/mutations";
import { useGetAllUsers } from "../hooks/queries";

import ViewUserModal from "./ViewUserModal";

import DataTable from "@/components/DataTable";
import { VerticalDotsIcon } from "@/components/VerticalDotsIcon";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function ManageUsers({ userRole }: { userRole: Role }) {
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [openViewUserModal, setOpenViewUserModal] = React.useState(false);
  const [action, setAction] = React.useState<"block" | "unblock">("block");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchKey] = React.useState("email");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [filters] = React.useState<{ key: string; value: string }[]>([
    { key: "role", value: userRole },
  ]);

  const { data, isLoading } = useGetAllUsers({
    searchQuery,
    page,
    pageSize,
    searchKey,
    filters,
  });
  const blockUserMutation = useBlockUserMutaion({
    filters,
    page,
    pageSize,
    searchKey,
    searchQuery,
  });
  const unblockUserMutation = useUnblockUserMutation({
    filters,
    page,
    pageSize,
    searchKey,
    searchQuery,
  });

  React.useEffect(() => {
    if (selectedUser && data?.users) {
      const updatedUser = data.users.find((u) => u.id === selectedUser.id);

      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  }, [data?.users, selectedUser]);

  async function handleBlockStudent(userId: string) {
    blockUserMutation.mutate(userId);
    setOpenConfirmModal(false);
  }

  async function handleUnblockStudent(userId: string) {
    unblockUserMutation.mutate(userId);
    setOpenConfirmModal(false);
  }

  const handleCloseViewUserModal = () => {
    setOpenViewUserModal(false);
    setSelectedUser(null);
  };

  const handleCloseConfirmationModal = () => {
    setOpenConfirmModal(false);
    setSelectedUser(null);
  };

  const baseColumns = [
    // { uid: "id", name: "ID" },
    { uid: "firstName", name: "First Name" },
    { uid: "lastName", name: "Last Name" },
    { uid: "email", name: "Email" },
    { uid: "contactNumber", name: "Contact Number" },
    { uid: "status", name: "Status" },
    { uid: "actions", name: "Actions" },
  ];

  const roleSpecificColumns: Record<Role, any> = {
    STUDENT: [{ uid: "studentId", name: "Id" }],
    TUTOR: [{ uid: "tutorId", name: "Id" }],
    ADMIN: [],
  };

  const userColumns = [
    ...(roleSpecificColumns[userRole] || []),
    ...baseColumns,
  ];

  const handleActionClick = (user: User, action: "block" | "unblock") => {
    setSelectedUser(user);
    setAction(action);
    setOpenConfirmModal(true);
  };

  const renderCell = React.useCallback((user: User, columnKey: string) => {
    switch (columnKey) {
      case "studentId":
        return <p className="w-fit">{user.student?.id}</p>;
      case "tutorId":
        return <p className="w-fit">{user.tutor?.id}</p>;
      case "firstName":
        return <p className="capitalize">{user?.firstName}</p>;
      case "lastName":
        return <p className="capitalize">{user?.lastName}</p>;
      case "email":
        return <p> {user?.email}</p>;
      case "contactNumber":
        return <p>{user?.contactNumber}</p>;
      case "allowedCourses":
        return <p>{user.student?.enrolledCourses.toString()}</p>;
      case "status":
        return (
          <Chip
            className="capitalize"
            color={user?.isActive ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {user?.isActive ? "Active" : "Blocked"}
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
                <DropdownItem
                  key="view"
                  onPress={() => {
                    setSelectedUser(user);
                    setOpenViewUserModal(true);
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  key="status"
                  onPress={() => {
                    handleActionClick(
                      user,
                      user?.isActive ? "block" : "unblock",
                    );
                  }}
                >
                  {user?.isActive ? "Block" : "Unblock"}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <>
      <DataTable
        columns={userColumns}
        data={data?.users || []}
        isLoading={isLoading}
        keyProp={searchKey}
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
        message={`Are you sure that you want to ${action} the student
                  ${selectedUser?.email}`}
        onClose={handleCloseConfirmationModal}
        onConfirm={
          action === "block"
            ? () => {
                selectedUser && handleBlockStudent(selectedUser.id);
              }
            : () => {
                selectedUser && handleUnblockStudent(selectedUser.id);
              }
        }
      />
      <ViewUserModal
        handleModalClose={handleCloseViewUserModal}
        isOpen={openViewUserModal}
        role={selectedUser?.role.toLowerCase() as Role}
        user={selectedUser}
      />
    </>
  );
}
