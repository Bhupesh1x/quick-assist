import Image from "next/image";

export function ConversationsView() {
  return (
    <div className="flex h-full flex-1 w-full items-center justify-center">
      <div className="flex items-center gap-x-2">
        <Image src="/logo.svg" alt="logo" height={40} width={40} />
        <p className="text-lg font-[600]">Quick Assist</p>
      </div>
    </div>
  );
}
