import { Select, SelectItem } from '@heroui/select';
import React from 'react';
import { Selection } from '@heroui/table';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { useAuthStore } from '@/store/auth-store';
// eslint-disable-next-line boundaries/element-types
import { useBecomeAInstructor } from '@/features/instructor/hooks/useBecomeAInstructor';
import AcademicIcon from '@/components/icons/AcademicIcon';
import LearnerIcon from '@/components/icons/LearnerIcon';
import { useChatStore } from '@/store/useChatStore';
import { Role } from '@/shared/enums/Role';

import ConfirmationModal from './ConfirmationModal';
import ErrorModal from './ErrorModal';

export default function RoleSwitcher() {
  const location = useLocation();
  const [errors, setErrors] = React.useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
  const currentRole = location.pathname.startsWith('/instructor')
    ? new Set(['INSTRUCTOR'])
    : new Set(['LEARNER']);

  const [role, setRole] = React.useState<Selection>(currentRole);

  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const becomeAInstructor = useBecomeAInstructor({
    onError: (error: string) => {
      setShowErrorModal(true);
      const parsedErrors = JSON.parse(error) as { errors: string[] };

      console.log(parsedErrors.errors);
      setErrors(parsedErrors.errors || ['An unknown error occurred']);
    },
  });
  const { resetSelectedChat } = useChatStore();

  const roles: Array<{ key: string; label: string; icon: React.ReactNode }> = [
    {
      key: 'LEARNER',
      label: 'Learner',
      icon: <LearnerIcon width={24} />,
    },
    {
      key: 'INSTRUCTOR',
      label: 'Instructor',
      icon: <AcademicIcon width={24} />,
    },
  ];

  function handleSelectionChange(value: string) {
    if (value === 'INSTRUCTOR' && user) {
      if (!user.roles.includes(Role.INSTRUCTOR)) {
        setOpenConfirmationModal(true);
      } else {
        setRole(new Set(['INSTRUCTOR']));
        resetSelectedChat();
        navigate({ to: '/instructor' });
      }
    } else if (value === 'LEARNER') {
      setRole(new Set(['LEARNER']));
      resetSelectedChat();
      navigate({ to: '/home' });
    }
  }

  return (
    <>
      <Select
        aria-label="Select role"
        items={roles}
        renderValue={(items) => {
          return items.map((item) => (
            <p key={item.key} className="flex gap-2">
              {item.data?.icon}
              {item.data?.label}
            </p>
          ));
        }}
        selectedKeys={role}
        onSelectionChange={(value) => {
          handleSelectionChange(value.anchorKey as string);
        }}
      >
        {(role) => (
          <SelectItem key={role.key} textValue={role.label}>
            <p className="flex gap-2">
              {role.icon}
              {role.label}
            </p>
          </SelectItem>
        )}
      </Select>
      <ConfirmationModal
        cancelText="No cancel"
        confirmText="Yes continue"
        isOpen={openConfirmationModal}
        message="Ready to share your expertise? By confirming, you’ll gain instructor access to create and sell courses, offer paid video mentorship sessions, and engage with students through real-time messaging. Unlock powerful tools and dashboards to manage your content and earnings. Are you ready to inspire learners and grow your impact?"
        title="Become a Instructor"
        onClose={() => {
          setOpenConfirmationModal(false);
        }}
        onConfirm={() => {
          becomeAInstructor.mutate();
          setOpenConfirmationModal(false);
        }}
      />
      <ErrorModal
        errors={errors}
        isOpen={showErrorModal}
        title="Please complete the requirements to become an instructor"
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
}
