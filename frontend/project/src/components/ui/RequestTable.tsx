import type { DocumentRequest, DocumentType, RequestStatus } from '@/types';
import { StatusBadge } from './StatusBadge';
import { documentTypeLabels } from '@/mocks/data';
import { formatDate } from '@/utils/helpers';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

export function RequestTable({
  requests,
  basePath = '/student/requests',
  showStudent = false,
}: {
  requests: DocumentRequest[];
  basePath?: string;
  showStudent?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Request ID</th>
            {showStudent && <th className="px-4 py-3 font-medium">Student</th>}
            <th className="px-4 py-3 font-medium">Document Type</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Last Updated</th>
            <th className="px-4 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((r) => (
            <tr key={r.id} className="transition-colors hover:bg-slate-50/60">
              <td className="px-4 py-3 font-medium text-navy-800">{r.requestRef}</td>
              {showStudent && (
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-800">{r.studentName}</p>
                  <p className="text-xs text-slate-500">{r.studentEmail}</p>
                </td>
              )}
              <td className="px-4 py-3 text-slate-600">
                {documentTypeLabels[r.documentType]}
              </td>
              <td className="px-4 py-3 text-slate-600">{formatDate(r.submittedAt)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">{formatDate(r.updatedAt)}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`${basePath}/${r.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { DocumentType, RequestStatus };
