interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <main className="min-h-screen min-w-screen h-full flex items-center justify-center">
      {children}
    </main>
  );
}
