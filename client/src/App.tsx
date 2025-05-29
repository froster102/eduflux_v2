import { Route, Routes } from "react-router";

import DefaultLayout from "./layouts/DefaultLayout";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import InstructorRoutes from "./routes/InstructorRoutes";
import NotFoundPage from "./components/NotFound";
import StudentRoutes from "./routes/StudentRoutes";

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route element={<AuthRoutes />} path="/auth/*" />
        <Route element={<StudentRoutes />} path="/*" />
        <Route element={<AdminRoutes />} path="/admin/*" />
        <Route element={<InstructorRoutes />} path="/instructor/*" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
}

export default App;
