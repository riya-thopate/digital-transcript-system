import { Loader2 } from 'lucide-react';

export function LoadingState({
  fullScreen = false,
  message = 'Loading...',
}: {
  fullScreen?: boolean;
  message?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? 'min-h-screen' : 'py-20'
      }`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
