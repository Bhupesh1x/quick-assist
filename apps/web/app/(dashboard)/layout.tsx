import { OrgGuard } from "@/features/auth/components/OrgGuard";
import { AuthGuard } from "@/features/auth/components/AuthGuard";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return (
    <AuthGuard>
      <OrgGuard>{children}</OrgGuard>
    </AuthGuard>
  );
}

export default layout;
