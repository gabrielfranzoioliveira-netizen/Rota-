import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <ExtraFeaturePage kind="notifications" />
    </AuthGuard>
  );
}
