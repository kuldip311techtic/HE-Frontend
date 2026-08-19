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
      className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm leading-5 text-danger"
    >
      {message}
    </div>
  );
}
