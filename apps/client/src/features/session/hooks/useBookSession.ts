import { useMutation } from '@tanstack/react-query';

import { bookSession } from '../services/session';

export function useBookSession() {
  return useMutation({
    mutationFn: bookSession,
  });
}
