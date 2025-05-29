import { Route, Routes } from "react-router";

import OverviewPage from "@/pages/tutor/Overview";
import NotFoundPage from "@/components/NotFound";
import PersistSignin from "@/features/auth/components/PersistSignin";
import RequireAuth from "@/features/auth/components/RequireAuth";
import AccountPage from "@/pages/tutor/Account";
import NotesListPage from "@/pages/tutor/NotesList";
import SessionsPage from "@/pages/tutor/Sessions";
import Meeting from "@/features/components/Meeting";
import { MeetingProvider } from "@/context/MeetingContext";
import InstructorDashboardLayout from "@/features/instructor/layouts/InstructorDashboardLayout";

export default function TutorRoutes() {
  return (
    <Routes>
      <Route element={<PersistSignin />}>
        <Route element={<RequireAuth allowedRoles={["INSTRUCTOR"]} />}>
          <Route element={<InstructorDashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route element={<AccountPage />} path="/account" />
            <Route element={<NotesListPage />} path="/notes" />
            <Route element={<SessionsPage />} path="/sessions" />
            <Route
              element={
                <MeetingProvider>
                  <Meeting />
                </MeetingProvider>
              }
              path="/sessions/:sessionId"
            />
            <Route element={<NotFoundPage />} path="*" />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
