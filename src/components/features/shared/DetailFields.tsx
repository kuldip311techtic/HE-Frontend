import * as React from 'react';

interface DetailField {
  label: string;
  value: React.ReactNode;
}

interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface DetailFieldsProps {
  sections: DetailSection[];
}

export function DetailFields({ sections }: DetailFieldsProps) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h3 className="text-body-13 text-foreground">{section.title}</h3>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.label} className="space-y-1">
                <dt className="text-body-sm text-muted-foreground">{field.label}</dt>
                <dd className="break-words text-body-21 text-foreground">{field.value ?? '—'}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
