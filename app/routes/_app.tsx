import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "~/components/header";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="bg-background relative flex h-screen min-h-svh flex-col overflow-hidden">
      <div className="border-border flex flex-1 flex-col">
        <Header />
        <main className="h-[calc(100vh-64px)] grow">
          <div className="border-border 3xl:border-l 3xl:border-r mx-auto h-full max-w-[102rem]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
