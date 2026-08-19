interface BrandMarkProps {
  dark?: boolean;
}

export default function BrandMark({ dark = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid h-11 w-11 place-items-center rounded-xl ${
          dark ? 'bg-primary text-accent' : 'bg-accent text-secondary'
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16 4v24M4 16h24M7.5 8.5c5 3.5 12 3.5 17 0M7.5 23.5c5-3.5 12-3.5 17 0"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </span>
      <div>
        <p
          className={`text-lg font-bold leading-6 ${
            dark ? 'text-ink' : 'text-secondary'
          }`}
        >
          Hoops Engine
        </p>
        <p className={dark ? 'text-xs text-muted' : 'text-xs text-navy-muted'}>
          Super Admin
        </p>
      </div>
    </div>
  );
}
