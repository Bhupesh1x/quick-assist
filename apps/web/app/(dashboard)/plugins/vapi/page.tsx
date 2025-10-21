import { Protect } from "@clerk/nextjs";

import { VapiView, VapiViewSkeleton } from "@/features/plugins/views/VapiView";
import { PremiumFeatureOverlay } from "@/features/billings/components/PremiumFeatureOverlay";

function VoiceAssistantsPage() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <VapiViewSkeleton />
        </PremiumFeatureOverlay>
      }
    >
      <VapiView />
    </Protect>
  );
}

export default VoiceAssistantsPage;
