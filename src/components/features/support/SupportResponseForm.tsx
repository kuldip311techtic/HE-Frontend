import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SUPPORT_MUTATIONS_UNAVAILABLE } from '@/components/features/support/supportCopy';

export function SupportResponseForm() {
  const unavailableId = React.useId();
  const responseId = React.useId();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor={responseId}>Response</Label>
        <Textarea
          id={responseId}
          readOnly
          disabled
          aria-describedby={unavailableId}
        />
      </div>
      <p id={unavailableId} className="text-body-sm text-muted-foreground">
        {SUPPORT_MUTATIONS_UNAVAILABLE}
      </p>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="submit"
          variant="brand"
          disabled
          aria-disabled="true"
          aria-describedby={unavailableId}
        >
          Respond
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled
          aria-disabled="true"
          aria-describedby={unavailableId}
        >
          Close request
        </Button>
      </div>
    </form>
  );
}
