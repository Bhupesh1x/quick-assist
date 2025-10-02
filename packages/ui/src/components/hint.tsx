import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface Props {
  children: React.ReactNode;
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}

export function Hint({
  children,
  text,
  side = "top",
  align = "center",
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
