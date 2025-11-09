import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

import UsersTable from '@/features/admin/components/UsersTable';
import { useListUsers } from '@/features/admin/hooks/useListUsers';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useBanUser } from '@/features/admin/hooks/useBanUser';
import { useUnbanUser } from '@/features/admin/hooks/useUnbanUser';

export const Route = createFileRoute('/admin/_layout/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const [listUsersQuery, setListUsersQuery] = React.useState<ListUsersQuery>({
    searchField: 'name',
    searchOperator: 'contains',
  });
  const { data, isPending } = useListUsers(listUsersQuery);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [isActionPending, setIsActionPending] = React.useState(false);

  const [selectedUser, setSelectedUser] = React.useState<ExtendedUser | null>(
    null,
  );
  const [selectedAction, setSelectedAction] =
    React.useState<UserTableAction | null>(null);

  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  const handleUserTableAction = (
    user: ExtendedUser,
    action: UserTableAction,
  ) => {
    if (action === 'view') {
      // console.log("Viewing user:", user);

      return;
    }

    setSelectedUser(user);
    setSelectedAction(action);

    switch (action) {
      case 'ban':
        setModalMessage(`Are you sure you want to ban user ${user.name}?`);
        break;
      case 'unban':
        setModalMessage(`Are you sure you want to unban user ${user.name}?`);
        break;
      default:
        setModalMessage('Are you sure you want to perform this action?');
    }

    setOpenConfirmationModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !selectedAction) return;

    setIsActionPending(true);

    try {
      switch (selectedAction) {
        case 'ban':
          await banUser.mutateAsync(selectedUser.id);
          break;
        case 'unban':
          await unbanUser.mutateAsync(selectedUser.id);
          break;
      }

      setOpenConfirmationModal(false);
      setSelectedUser(null);
      setSelectedAction(null);
    } finally {
      setIsActionPending(false);
    }
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
          users={(data?.users as ExtendedUser[]) ?? []}
          onSearchChange={(value) => {
            setListUsersQuery((prev) => ({
              ...prev,
              searchValue: value,
            }));
          }}
        />
      </div>

      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Yes, continue"
        isOpen={openConfirmationModal}
        loading={isActionPending}
        message={modalMessage}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
