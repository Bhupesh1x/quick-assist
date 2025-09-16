import { AuthGuard } from "@/features/auth/components/AuthGuard";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return <AuthGuard>{children}</AuthGuard>;
}

export default layout;
