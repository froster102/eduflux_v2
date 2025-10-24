import { Skeleton } from "@heroui/skeleton";

import ProfileForm from "./forms/ProfileForm";
import { useUpdateProfile } from "./hooks/useUpdateProfile";
import { useGetUserProfile } from "./hooks/useGetUserProfile";

export default function ProfileTab() {
  const { data: profile, isLoading: isProfileLoading } = useGetUserProfile();
  const updateProfile = useUpdateProfile();

  function onProfileUpdateHandler(data: Partial<UserProfile>) {
    updateProfile.mutate(data);
  }

  return (
    <Skeleton className="rounded-lg bg-background" isLoaded={!isProfileLoading}>
      {!isProfileLoading && (
        <ProfileForm
          initialValue={profile?.data!}
          onSubmitHandler={onProfileUpdateHandler}
        />
      )}
    </Skeleton>
  );
}
