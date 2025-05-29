import { Divider } from "@heroui/divider";
import React from "react";
import { Button } from "@heroui/button";
import { PlusIcon } from "lucide-react";

import ManageUsers from "@/features/admin/users/components/ManageUsers";
import AddTutorModal from "@/features/admin/users/components/AddTutorModal";

export default function TutorsListPage() {
  const [openTutorForm, setOpenAddTutorForm] = React.useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Tutors</p>
          <small className="text-sm text-default-500">
            Below are the list of tutors
          </small>
        </div>
        <Button color="primary" onPress={() => setOpenAddTutorForm(true)}>
          Add Tutor <PlusIcon />{" "}
        </Button>
      </div>
      <Divider className="mt-4 mb-4" orientation="horizontal" />
      <ManageUsers userRole="TUTOR" />
      <AddTutorModal
        openAddForm={openTutorForm}
        onClose={() => setOpenAddTutorForm(false)}
      />
    </div>
  );
}
