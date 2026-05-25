import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <ExtraFeaturePage kind="favorites" />
    </AuthGuard>
  );
}
