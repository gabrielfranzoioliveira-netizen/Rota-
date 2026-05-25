import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg bg-brand-soft/60 text-brand-primary">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
