import { AlertCircle } from 'lucide-react';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-error-100 bg-error-50/50 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-100">
        <AlertCircle className="h-7 w-7 text-error-600" />
      </div>
      <h3 className="text-base font-semibold text-error-700">Something went wrong</h3>
      <p className="mt-1.5 max-w-sm text-sm text-error-600">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary mt-5">
          Try again
        </button>
      )}
    </div>
  );
}
