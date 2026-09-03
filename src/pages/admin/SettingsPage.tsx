import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Settings"
        description="Configure admin panel preferences and account settings."
      />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-body-25 text-foreground">
            Admin preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body-21 text-muted-foreground">
            Account and workspace settings will be available here as modules are
            enabled.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
