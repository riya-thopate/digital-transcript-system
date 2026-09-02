import { useRef, useState } from 'react';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/utils/helpers';

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

export function FileUpload({
  files,
  onChange,
  maxFiles = 5,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const validate = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) return `${file.name}: unsupported file type`;
    if (file.size > MAX_SIZE) return `${file.name}: file exceeds 5MB limit`;
    return null;
  };

  const addFiles = (newFiles: FileList | File[]) => {
    setError(null);
    const valid: File[] = [];
    Array.from(newFiles).forEach((file) => {
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      valid.push(file);
    });
    const combined = [...files, ...valid].slice(0, maxFiles);
    onChange(combined);
  };

  const removeFile = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging ? 'border-navy-500 bg-navy-50' : 'border-slate-300 hover:border-navy-400 hover:bg-slate-50'
        }`}
      >
        <UploadCloud className="h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-navy-800">
          Click to upload or drag and drop
        </p>
        <p className="mt-1 text-xs text-slate-500">
          PDF, JPG, PNG, DOC up to 5MB each (max {maxFiles} files)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-error-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FileIcon className="h-4 w-4 flex-shrink-0 text-navy-600" />
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium text-navy-800">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-error-600"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
