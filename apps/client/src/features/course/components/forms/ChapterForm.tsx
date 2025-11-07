import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@heroui/button';

import { sectionSchema } from '@/features/course/schemas/course';

export default function ChapterForm({
  onSubmitHandler,
  isPending,
  mode,
  onCancel,
  initialValue,
}: DefaultFormProps<ChapterFormData>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChapterFormData>({
    resolver: zodResolver(sectionSchema as any),
    defaultValues: mode === 'edit' ? initialValue : {},
  });

  return (
    <Form
      className="pt-0 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <Input
        {...register('title')}
        errorMessage={errors.title?.message}
        isInvalid={!!errors.title}
        label="Title"
        labelPlacement="outside"
        name="title"
        placeholder="Enter chapter title"
        type="text"
        variant="faded"
      />
      <Textarea
        {...register('description')}
        disableAutosize={false}
        errorMessage={errors.description?.message}
        isInvalid={!!errors.description}
        label="Description"
        labelPlacement="outside"
        placeholder="What is this chapter about"
        variant="faded"
      />
      <div className="ml-auto">
        <Button color="danger" variant="flat" onPress={onCancel}>
          Close
        </Button>
        <Button
          className="ml-2"
          color="primary"
          isDisabled={isPending}
          isLoading={isPending}
          type="submit"
        >
          Create
        </Button>
      </div>
    </Form>
  );
}
