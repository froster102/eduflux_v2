import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import UsersTable from "@/features/admin/components/UsersTable";
import { useListUsers } from "@/features/admin/hooks/useListUsers";

export const Route = createFileRoute("/admin/_layout/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending } = useListUsers();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [openConfirmationModal, setOpenConfirmation] =
    React.useState<boolean>(false);

  const handleUserTableAction = (
    user: ExtendedUser,
    action: UserTableAction,
  ) => {
    switch (action) {
      case "view": {
        console.log(user, action);
        break;
      }
      case "ban": {
        break;
      }
      case "unban": {
        break;
      }
      default: {
        null;
      }
    }
    setOpenConfirmation(true);
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-lg font-bold mb-4">Users</h1>
        <UsersTable
          handleAction={handleUserTableAction}
          isLoading={isPending}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearchFilter={setSearchFilter}
          users={data?.data?.users ?? []}
        />
      </div>
    </>
  );
}
