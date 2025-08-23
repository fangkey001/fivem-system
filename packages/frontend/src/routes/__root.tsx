import { createRootRoute, Outlet } from "@tanstack/react-router";
import { RootLayout } from "@/shared/components/layout/root.layout";

export const Route = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});
