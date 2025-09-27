import { WidgetAuthScreen } from "@/features/widget/screens/WidgetAuthScreen";

interface Props {
  searchParams: Promise<{
    organizationId: string;
  }>;
}

async function Page({ searchParams }: Props) {
  const { organizationId } = await searchParams;

  return <WidgetAuthScreen />;
}

export default Page;
