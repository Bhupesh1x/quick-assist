import { DashboardLayout } from "@/features/dashboard/layouts/DashboardLayout";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default layout;
