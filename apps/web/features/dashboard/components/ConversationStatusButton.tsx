"use client";

import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

import { getNewConversationStatus } from "../lib";

import { Hint } from "@workspace/ui/components/hint";
import { Button } from "@workspace/ui/components/button";
import { Doc } from "@workspace/backend/_generated/dataModel";

interface Props {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}

const statusMap = {
  resolved: {
    variant: "tertiary",
    icon: CheckIcon,
  },
  escalated: {
    variant: "warning",
    icon: ArrowUpIcon,
  },
  unresolved: {
    variant: "destructive",
    icon: ArrowRightIcon,
  },
};

export function ConversationStatusButton({ status, onClick, disabled }: Props) {
  const statusValue = statusMap[status];
  const Icon = statusValue?.icon;

  return (
    <Hint text={`Mark as ${getNewConversationStatus(status)}`}>
      <Button
        size="sm"
        onClick={onClick}
        disabled={disabled}
        variant={statusValue?.variant as "tertiary" | "destructive" | "warning"}
      >
        <Icon />
        <span className="capitalize">{status}</span>
      </Button>
    </Hint>
  );
}
