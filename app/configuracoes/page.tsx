import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <ExtraFeaturePage kind="settings" />
    </AuthGuard>
  );
}
