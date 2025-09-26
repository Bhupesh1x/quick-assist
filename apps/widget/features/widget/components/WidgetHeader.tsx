interface Props {
  children: React.ReactNode;
  className?: string;
}

export function WidgetHeader({ children, className = "" }: Props) {
  return (
    <header
      className={`bg-gradient-to-b from-primary to-[#0b63f3] p-4 text-primary-foreground ${className}`}
    >
      {children}
    </header>
  );
}
