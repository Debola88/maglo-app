import DashboardLayoutWrapper from "@/components/layouts/dashboard";
import { ProtectedRoute } from "@/components/auth/protected-route";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </ProtectedRoute>
  );
}
