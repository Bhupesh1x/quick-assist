import { Protect } from "@clerk/nextjs";

import { FilesView } from "@/features/files/views/FilesView";
import { PremiumFeatureOverlay } from "@/features/billings/components/PremiumFeatureOverlay";

function FilesPage() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <FilesView isOverlay={true} />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </Protect>
  );
}

export default FilesPage;
