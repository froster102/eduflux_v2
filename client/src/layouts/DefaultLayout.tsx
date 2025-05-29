import { Outlet } from "react-router";

export default function DefaultLayout() {
  return (
    <main className="h-full">
      <div className="max-h-dvh bg-background ">
        <div className="relative flex flex-col h-dvh subpixel-antialiased">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
