import { cookies } from "next/headers";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { OrgGuard } from "@/features/auth/components/OrgGuard";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

import { DashboardSidebar } from "../components/DashboardSidebar";

interface Props {
  children: React.ReactNode;
}

export async function DashboardLayout({ children }: Props) {
  const cookieSidebar = await cookies();

  const defaultOpen = cookieSidebar?.get("sidebar_state")?.value === "true";

  return (
    <AuthGuard>
      <OrgGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <main className="flex flex-col flex-1">{children}</main>
        </SidebarProvider>
      </OrgGuard>
    </AuthGuard>
  );
}
