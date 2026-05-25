import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function HistoryPage() {
  return (
    <AuthGuard>
      <ExtraFeaturePage kind="history" />
    </AuthGuard>
  );
}
