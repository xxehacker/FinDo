import { PageHeader } from "./page-header";
import { Button } from "./button";
import { Alert } from "./alert";

function FormPageLayout({
  title,
  description,
  breadcrumbs,
  onBack,
  backLabel = "← Back to list",
  error,
  children,
}) {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          onBack && (
            <Button variant="outline" onClick={onBack}>
              {backLabel}
            </Button>
          )
        }
      />
      {error && <Alert variant="destructive">{error}</Alert>}
      <div className="neo-card p-6 sm:p-8">{children}</div>
    </div>
  );
}

export { FormPageLayout };
