import { Route, Routes } from "react-router";

import OverviewPage from "@/pages/admin/Overview";
import StudentsListPage from "@/pages/admin/StudentsList";
import TutorsListPage from "@/pages/admin/TutorsList";
import CoursesListPage from "@/pages/admin/CoursesList";
import SessionsListPage from "@/pages/admin/SessionsList";
import AddCoursePage from "@/pages/admin/AddCourse";
import NotFoundPage from "@/components/NotFound";
import PersistSignin from "@/features/auth/components/PersistSignin";
import EditCoursePage from "@/pages/admin/EditCourse";
import EnrollmentsListPage from "@/pages/admin/EnrollmentsList";
import AdminDashboardLayout from "@/features/admin/layouts/AdminDashboardLayout";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<PersistSignin />}>
        {/* <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}> */}
        <Route element={<AdminDashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route element={<StudentsListPage />} path="/students" />
          <Route element={<TutorsListPage />} path="/tutors" />
          <Route element={<CoursesListPage />} path="/courses" />
          <Route element={<SessionsListPage />} path="/sessions" />
          <Route element={<AddCoursePage />} path="/courses/add" />
          <Route element={<EditCoursePage />} path="/courses/:courseId" />
          <Route element={<EnrollmentsListPage />} path="/enrollments" />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Route>
      {/* </Route> */}
    </Routes>
  );
}
