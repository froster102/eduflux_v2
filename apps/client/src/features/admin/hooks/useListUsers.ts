import { useQuery } from '@tanstack/react-query';

import { listUsers } from '@/features/admin/service/admin';

export function useListUsers(query: ListUsersQuery) {
  return useQuery({
    queryKey: ['users', query],
    queryFn: () => listUsers(query),
  });
}
