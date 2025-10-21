import { Protect } from "@clerk/nextjs";

import { FilesView, FilesViewSkeleton } from "@/features/files/views/FilesView";
import { PremiumFeatureOverlay } from "@/features/billings/components/PremiumFeatureOverlay";

function FilesPage() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <FilesViewSkeleton />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </Protect>
  );
}

export default FilesPage;
