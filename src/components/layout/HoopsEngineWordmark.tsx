import { cn } from '@/lib/utils';

interface HoopsEngineWordmarkProps {
  className?: string;
}

export function HoopsEngineWordmark({ className }: HoopsEngineWordmarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 32"
      fill="none"
      role="img"
      aria-label="Hoops Engine"
      className={cn('h-8 w-auto', className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <circle
        cx="16"
        cy="16"
        r="9"
        className="stroke-sidebar-foreground"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M16 7v18M7 16h18"
        className="stroke-sidebar-foreground"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="40"
        y="22"
        className="fill-sidebar-foreground"
        style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--font-size-base)', fontWeight: 600 }}
        letterSpacing="-0.02em"
      >
        Hoops Engine
      </text>
    </svg>
  );
}
