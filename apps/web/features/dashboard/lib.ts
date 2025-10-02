import { Doc } from "@workspace/backend/_generated/dataModel";

export function getNewConversationStatus(
  status: Doc<"conversations">["status"]
) {
  // Status cycle : unresolved -> escalated -> resolved

  if (status === "unresolved") {
    return "escalated";
  }

  if (status === "escalated") {
    return "resolved";
  }

  if (status === "resolved") {
    return "unresolved";
  }
}
