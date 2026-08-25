interface ErrorMessageProps {
  message: string;
  id?: string;
}

export default function ErrorMessage({ message, id }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive"
    >
      {message}
    </div>
  );
}
