import { AuthLayout } from "@/features/auth/layouts/AuthLayout";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return <AuthLayout>{children}</AuthLayout>;
}

export default Layout;
