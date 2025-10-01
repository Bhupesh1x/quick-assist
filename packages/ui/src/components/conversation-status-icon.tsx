import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface Props {
  status: "resolved" | "escalated" | "unresolved";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-[#3FB62F]",
  },
  unresolved: {
    icon: ArrowRightIcon,
    bgColor: "bg-destructive",
  },
  escalated: {
    icon: ArrowUpIcon,
    bgColor: "bg-yellow-500",
  },
} as const;

export function ConversationStatusIcon({ status, className = "" }: Props) {
  const config = statusConfig[status];
  const Icon = config?.icon;

  return (
    <div
      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full p-0.5 ${config?.bgColor} ${className}`}
    >
      <Icon className="h-full w-full stroke-3 text-white" />
    </div>
  );
}
