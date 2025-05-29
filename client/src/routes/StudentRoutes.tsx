import { Route, Routes } from "react-router";

import OverviewPage from "@/pages/student/Overview";
import CoursesListPage from "@/pages/student/CoursesList";
import TutorsListPage from "@/pages/student/TutorsList";
import NotesListPage from "@/pages/student/NotesList";
import NotFoundPage from "@/components/NotFound";
import AccountPage from "@/pages/student/Account";
import CoursePage from "@/pages/student/CoursePage";
import SessionsPage from "@/pages/student/Sessions";
import Meeting from "@/features/components/Meeting";
import { MeetingProvider } from "@/context/MeetingContext";
import ChatbotPage from "@/pages/student/Chatbot";
import StudentDashboardLayout from "@/features/student/layouts/StudentDashboardLayout";
import PersistSignin from "@/features/auth/components/PersistSignin";
import RequireAuth from "@/features/auth/components/RequireAuth";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<PersistSignin />}>
        <Route element={<RequireAuth allowedRoles={["STUDENT"]} />}>
          <Route element={<StudentDashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route element={<CoursesListPage />} path="/courses" />
            <Route element={<CoursePage />} path="/courses/:courseId" />
            <Route element={<TutorsListPage />} path="/tutors" />
            <Route element={<NotesListPage />} path="/notes" />
            <Route element={<SessionsPage />} path="/sessions" />
            <Route element={<ChatbotPage />} path="/chat-bot" />
            <Route
              element={
                <MeetingProvider>
                  <Meeting />
                </MeetingProvider>
              }
              path="/sessions/:sessionId"
            />
            <Route element={<AccountPage />} path="/account" />
          </Route>
        </Route>
      </Route>
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
