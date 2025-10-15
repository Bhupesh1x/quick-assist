import { Protect } from "@clerk/nextjs";

import { VapiView } from "@/features/plugins/views/VapiView";
import { PremiumFeatureOverlay } from "@/features/billings/components/PremiumFeatureOverlay";

function VoiceAssistantsPage() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <VapiView isOverlay={true} />
        </PremiumFeatureOverlay>
      }
    >
      <VapiView />
    </Protect>
  );
}

export default VoiceAssistantsPage;
