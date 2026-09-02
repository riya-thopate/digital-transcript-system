import type { Document } from '@/types';
import { DocumentStatusBadge } from './StatusBadge';
import { documentTypeLabels } from '@/mocks/data';
import { formatDate, formatFileSize } from '@/utils/helpers';
import { FileText, Download } from 'lucide-react';

export function DocumentCard({
  document,
  onDownload,
  downloading,
}: {
  document: Document;
  onDownload?: () => void;
  downloading?: boolean;
}) {
  return (
    <div className="card p-5 transition-all hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-100">
            <FileText className="h-5.5 w-5.5 text-navy-700" />
          </div>
          <div>
            <p className="font-semibold text-navy-900">{document.documentRef}</p>
            <p className="mt-0.5 text-sm text-slate-500">
              {documentTypeLabels[document.documentType]}
            </p>
          </div>
        </div>
        <DocumentStatusBadge status={document.status} />
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Student</dt>
          <dd className="font-medium text-navy-800">{document.studentName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Issue Date</dt>
          <dd className="font-medium text-navy-800">{formatDate(document.issueDate)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">File Size</dt>
          <dd className="font-medium text-navy-800">{formatFileSize(document.fileSize)}</dd>
        </div>
      </dl>
      <button
        onClick={onDownload}
        disabled={downloading || document.status !== 'ISSUED'}
        className="btn btn-secondary mt-4 w-full"
      >
        <Download className="h-4 w-4" />
        {downloading ? 'Downloading...' : 'Download'}
      </button>
    </div>
  );
}
