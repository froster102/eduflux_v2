import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";

import { useAuthStore } from "@/store/auth-store";
import ProfileForm from "@/components/ProfileForm";

export default function AccountPage() {
  const { user, session } = useAuthStore() as { user: User; session: Session };

  // const { data: userSessions, isLoading: isUserSessionsLoading } =
  //   useGetUserSessionsQuery();

  function onSubmit(data: User) {
    // updateStudentProfileMutation.mutate({
    //   updateData: data,
    //   userId,
    // });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">Account</p>
          <small className="text-default-500 text-sm">
            Your account details have been given below
          </small>
        </div>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <div
        className=" md:flex w-full gap-4 pt-4 px-0 md:px-4 lg:px-14 overflow-x-scroll scrollbar-hide scroll-smooth"
        data-lenis="false"
      >
        <div className=" md:max-w-[424px] w-full h-fit">
          {/* <ProfileCard
            accountStatus={userProfile?.isActive || true}
            email={userProfile?.email || ""}
            id={
              role === "STUDENT"
                ? userProfile?.student?.id
                : userProfile?.tutor?.id
            }
            lastLogin={formatTo12HourWithDate(
              new Date(activeSession?.lastLogin),
            )}
            name={user.name}
          /> */}

          <div className="pt-4  hidden md:block">
            {/* <RecentDevicesCard
              activeSession={activeSession!}
              isLoading={isUserSessionsLoading}
              userSessions={userSessions?.sessions!}
            /> */}
          </div>
        </div>
        <div className="w-full max-h-screen pt-4 md:pt-0 md:overflow-y-auto scrollbar-hide">
          <Skeleton className="rounded-lg bg-background" isLoaded={true}>
            <ProfileForm initialValues={} onSubmitHandler={onSubmit} />
          </Skeleton>
          <div className="pt-4">
            <PasswordForm />
          </div>
          <div className="pt-4 block md:hidden">
            {session && (
              <RecentDevicesCard
                activeSession={session}
                isLoading={false}
                userSessions={userSessions?.sessions!}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
