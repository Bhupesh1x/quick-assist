import { Provider } from "jotai";
import { cookies } from "next/headers";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";

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
        <Provider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar />
            <SidebarTrigger className="md:hidden p-2 min-w-10 size-10" />

            <main className="flex flex-col flex-1">{children}</main>
          </SidebarProvider>
        </Provider>
      </OrgGuard>
    </AuthGuard>
  );
}
