export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangeValidationResult {
  isValid: boolean;
  error: string | null;
}

function parseDateValue(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultDateRange(referenceDate = new Date()): DateRange {
  const endDate = new Date(referenceDate);
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - 29);

  return {
    startDate: formatDateInputValue(startDate),
    endDate: formatDateInputValue(endDate),
  };
}

export function validateDateRange(range: DateRange): DateRangeValidationResult {
  if (!range.startDate || !range.endDate) {
    return {
      isValid: false,
      error: 'Select both a start date and an end date.',
    };
  }

  const startDate = parseDateValue(range.startDate);
  const endDate = parseDateValue(range.endDate);

  if (!startDate || !endDate) {
    return {
      isValid: false,
      error: 'Enter valid dates in YYYY-MM-DD format.',
    };
  }

  if (startDate.getTime() > endDate.getTime()) {
    return {
      isValid: false,
      error: 'Start date must be on or before the end date.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

export function formatDateRangeLabel(range: DateRange): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const startDate = parseDateValue(range.startDate);
  const endDate = parseDateValue(range.endDate);

  if (!startDate || !endDate) {
    return 'Selected period';
  }

  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}
