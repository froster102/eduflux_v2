import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { addToast } from '@heroui/toast';

import { publishCourse } from '../services/course';

export function usePublishCourse(options?: {
  onError: (errorMessage: string) => void;
}) {
  return useMutation({
    mutationFn: publishCourse,

    onError: (error: AxiosError<JsonApiErrorResponse>) => {
      if (
        options?.onError &&
        error.response?.data.errors[0].code === 'BAD_REQUEST_ERROR'
      ) {
        options.onError(error.response?.data.errors[0].title);

        return;
      }

      return;
    },

    onSuccess: () => {
      addToast({
        title: 'Course published',
        description: 'Your course has been successfully published',
        color: 'success',
      });
    },
  });
}
