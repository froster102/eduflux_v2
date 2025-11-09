import { Chip } from '@heroui/chip';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { Button } from '@heroui/button';

import DataTable from '@/components/DataTable';
import { VerticalDotsIcon } from '@/components/VerticalDotsIcon';
import { useAuthStore } from '@/store/auth-store';

const UserStatusColorMap: Record<'active' | 'banned', 'success' | 'danger'> = {
  active: 'success',
  banned: 'danger',
};

interface UserTableProps {
  users: ExtendedUser[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onSearchChange: (value: string) => void;
  handleAction: (user: ExtendedUser, action: UserTableAction) => void;
}

export default function UsersTable({
  users,
  isLoading,
  page,
  pageSize,
  setPage,
  setPageSize,
  onSearchChange,
  handleAction,
}: UserTableProps) {
  const { user: authUser } = useAuthStore();
  const columns = [
    { uid: 'name', name: 'Name', sortable: true },
    { uid: 'email', name: 'Email', sortable: true },
    { uid: 'status', name: 'Status' },
    { uid: 'roles', name: 'Roles' },
    { uid: 'createdAt', name: 'Created At', sortable: true },
    { uid: 'actions', name: 'Actions' },
  ];

  const renderCell = (user: ExtendedUser, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex">
            {user.id === authUser?.id ? (
              <>
                <p>{user.name}</p>
                <Chip className="text-4 p-1" size="sm">
                  {'self'}
                </Chip>
              </>
            ) : (
              user.name
            )}
          </div>
        );
      case 'email':
        return user.email;
      case 'roles':
        return user.roles.join(', ') ?? '-';
      case 'status':
        const status = user.banned ? 'banned' : 'active';

        return <Chip color={UserStatusColorMap[status]}>{status}</Chip>;
      case 'createdAt':
        return new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      case 'actions':
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon className="text-default-300" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Actions"
              disabledKeys={
                new Set(user.id === authUser!?.id ? ['view', 'ban'] : [])
              }
              variant="flat"
              onAction={(action) => {
                handleAction(user, action.toString() as UserTableAction);
              }}
            >
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem key={user.banned ? 'unban' : 'ban'}>
                {user.banned ? 'Unban' : 'Ban'}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return '';
    }
  };

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      keyProp="id"
      page={page}
      pageSize={pageSize}
      renderCell={renderCell}
      searchKey="name"
      tableName="Users"
      totalCount={users.length}
      onPaginationChange={setPage}
      onRowsPerPageChange={(rows) => {
        setPageSize(rows);
        setPage(1);
      }}
      onSeachValueChange={onSearchChange}
    />
  );
}
