import { cn } from "@/lib/utils";

/** Figma-aligned form control styles for admin dialogs — scoped to consuming pages only */
export const adminFormInputClass = cn(
  "h-10 w-full rounded-[10px] border border-figma-border bg-figma-surface px-[12px] py-[10px]",
  "font-outfit text-[16px] font-normal leading-[22px] text-white shadow-none",
  "placeholder:font-outfit placeholder:text-[16px] placeholder:font-normal placeholder:leading-[22px] placeholder:text-figma-muted",
  "focus-visible:border-figma-brand focus-visible:ring-2 focus-visible:ring-figma-brand/30 focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export const adminFormSelectTriggerClass = cn(
  "h-10 rounded-[10px] border border-figma-border bg-figma-surface",
  "font-outfit text-[16px] font-normal leading-[22px] text-white shadow-none",
  "focus:ring-2 focus:ring-figma-brand/30 focus:ring-offset-0",
);

export const adminFormPrimaryButtonClass = cn(
  "rounded-[10px] bg-figma-brand shadow-none",
  "font-outfit text-[16px] font-semibold leading-[20.16px] text-figma-border",
  "hover:bg-figma-brand/90 active:bg-figma-brand/80",
  "focus-visible:ring-2 focus-visible:ring-figma-brand focus-visible:ring-offset-2 focus-visible:ring-offset-figma-background",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:text-figma-border",
);

export const adminFormLabelClass = cn(
  "font-lato text-[16px] font-medium leading-[19.2px] text-white",
);

export const adminFormMessageClass = cn(
  "font-outfit text-[14px] font-medium leading-[17.64px] text-destructive",
);

export const adminToolbarSelectClass = cn(
  "h-9 rounded-[10px] border border-figma-border bg-figma-surface",
  "font-outfit text-[14px] font-medium leading-[17.64px] text-white shadow-none",
  "focus:ring-2 focus:ring-figma-brand/30 focus:ring-offset-0",
);

export const adminPrimaryActionClass = cn(
  "h-9 rounded-[10px] bg-figma-brand px-[16px] shadow-none",
  "font-outfit text-[14px] font-semibold leading-[17.64px] text-figma-border",
  "hover:bg-figma-brand/90 active:bg-figma-brand/80",
  "focus-visible:ring-2 focus-visible:ring-figma-brand focus-visible:ring-offset-2 focus-visible:ring-offset-figma-background",
  "[&_svg]:text-figma-border",
);

export const adminSearchInputClass = cn(
  "h-9 rounded-[10px] border border-figma-border bg-figma-surface pl-9 shadow-none",
  "font-outfit text-[14px] font-normal leading-[17.64px] text-white",
  "placeholder:text-figma-muted",
  "focus-visible:border-figma-brand focus-visible:ring-2 focus-visible:ring-figma-brand/30 focus-visible:ring-offset-0",
);

export const adminMetricCardClass = cn(
  "rounded-[10px] border border-figma-border bg-figma-surface shadow-none",
);

export const adminOutlineButtonClass = cn(
  "h-9 rounded-[10px] border border-figma-border bg-transparent px-[16px] shadow-none",
  "font-outfit text-[14px] font-medium leading-[17.64px] text-white",
  "hover:border-figma-brand/50 hover:bg-[var(--figma-brand-subtle)] hover:text-white",
  "focus-visible:ring-2 focus-visible:ring-figma-brand focus-visible:ring-offset-2 focus-visible:ring-offset-figma-background",
  "active:bg-figma-accent/30 disabled:opacity-50",
  "[&_svg]:text-figma-bright",
);

export const adminModuleNavLinkClass = cn(
  "flex h-auto min-h-[44px] w-full flex-col items-start gap-[4px] rounded-[10px]",
  "border border-figma-border bg-figma-surface px-[16px] py-[12px] text-left shadow-none",
  "font-outfit transition-colors",
  "hover:border-figma-brand/50 hover:bg-[var(--figma-brand-subtle)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand focus-visible:ring-offset-2 focus-visible:ring-offset-figma-background",
  "active:bg-figma-accent/30",
);

export const adminSectionCardClass = cn(
  "rounded-[10px] border border-figma-border bg-figma-surface shadow-none",
);
