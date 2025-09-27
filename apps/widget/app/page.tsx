import { WidgetView } from "@/features/widget/views/WidgetView";

interface Props {
  searchParams: Promise<{
    organizationId: string;
  }>;
}

async function Page({ searchParams }: Props) {
  const { organizationId } = await searchParams;

  return <WidgetView organizationId={organizationId} />;
}

export default Page;
