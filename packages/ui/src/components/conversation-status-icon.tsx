import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

interface Props {
  status: "resolved" | "escalated" | "unresolved";
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

export function ConversationStatusIcon({ status }: Props) {
  const config = statusConfig[status];
  const Icon = config?.icon;

  return (
    <div
      className={`flex size-5 flex-shrink-0 items-center justify-center rounded-full ${config?.bgColor}`}
    >
      <Icon className="size-4 stroke-3 text-white" />
    </div>
  );
}
