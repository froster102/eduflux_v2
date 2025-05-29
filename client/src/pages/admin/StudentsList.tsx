import { Divider } from "@heroui/divider";

import ManageUsers from "@/features/admin/users/components/ManageUsers";

export default function StudentsListPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Students</p>
          <small className="text-sm text-default-500">
            Below are the list of students
          </small>
        </div>
      </div>
      <Divider className="mt-4 mb-4" orientation="horizontal" />
      <ManageUsers userRole="STUDENT" />
    </>
  );
}
