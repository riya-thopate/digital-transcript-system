import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRequestById } from '@/services/requestApi';
import { downloadDocument } from '@/services/documentApi';
import type { DocumentRequest } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { documentTypeLabels, requestStatusLabels } from '@/mocks/data';
import { formatDateTime, formatFileSize } from '@/utils/helpers';
import {
  ArrowLeft, FileText, Download, Clock, CheckCircle2, X, MessageSquare, Paperclip, User
} from 'lucide-react';

export function StudentRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRequestById(id)
      .then(setRequest)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    if (!request?.issuedDocumentId) return;
    setDownloading(true);
    try {
      const blob = await downloadDocument(request.issuedDocumentId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${request.requestRef}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingState message="Loading request..." />;
  if (error || !request) return <ErrorState message="Request not found." onRetry={() => navigate('/student/requests')} />;

  return (
    <div className="space-y-6">
      <Link to="/student/requests" className="flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-800">
        <ArrowLeft className="h-4 w-4" />
        Back to requests
      </Link>

      <div className="card p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl font-bold text-navy-900">{request.requestRef}</h2>
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{documentTypeLabels[request.documentType]}</p>
          </div>
          {request.status === 'AVAILABLE' && request.issuedDocumentId && (
            <button onClick={handleDownload} disabled={downloading} className="btn btn-gold">
              <Download className="h-4 w-4" />
              {downloading ? 'Downloading...' : 'Download Document'}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Details */}
          <div className="card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Request Details</h3>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Detail label="Document Type" value={documentTypeLabels[request.documentType]} />
              <Detail label="Number of Copies" value={String(request.numberOfCopies)} />
              <Detail label="Submitted" value={formatDateTime(request.submittedAt)} />
              <Detail label="Last Updated" value={formatDateTime(request.updatedAt)} />
              <div className="sm:col-span-2">
                <Detail label="Purpose" value={request.purpose} />
              </div>
              {request.additionalInfo && (
                <div className="sm:col-span-2">
                  <Detail label="Additional Information" value={request.additionalInfo} />
                </div>
              )}
            </dl>
          </div>

          {/* Status Timeline */}
          <div className="card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Status Timeline</h3>
            <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
              {request.statusTimeline.map((event, i) => {
                const isLast = i === request.statusTimeline.length - 1;
                return (
                  <li key={event.id} className="relative">
                    <span className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                      isLast ? 'bg-navy-800' : 'bg-slate-300'
                    }`}>
                      {event.status === 'REJECTED' ? (
                        <X className="h-3.5 w-3.5 text-white" />
                      ) : isLast ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      ) : (
                        <Clock className="h-3 w-3 text-white" />
                      )}
                    </span>
                    <p className="text-sm font-medium text-navy-900">{requestStatusLabels[event.status]}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(event.timestamp)}</p>
                    {event.actor && <p className="mt-0.5 text-xs text-slate-400">by {event.actor}</p>}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Supporting Documents */}
          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-navy-900">
              <Paperclip className="h-5 w-5 text-navy-600" />
              Supporting Documents
            </h3>
            {request.supportingDocuments.length === 0 ? (
              <p className="text-sm text-slate-500">No supporting documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {request.supportingDocuments.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-navy-600" />
                      <div>
                        <p className="text-sm font-medium text-navy-800">{doc.fileName}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(doc.fileSize)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{formatDateTime(doc.uploadedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Remarks */}
          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-navy-900">
              <MessageSquare className="h-5 w-5 text-navy-600" />
              Administrator Remarks
            </h3>
            {request.remarks.length === 0 ? (
              <p className="text-sm text-slate-500">No remarks yet.</p>
            ) : (
              <ul className="space-y-4">
                {request.remarks.map((r) => (
                  <li key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2 text-sm font-medium text-navy-900">
                        <User className="h-3.5 w-3.5 text-navy-500" />
                        {r.adminName}
                      </p>
                      <span className="text-xs text-slate-400">{formatDateTime(r.timestamp)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{r.remark}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Student Information</h3>
            <dl className="space-y-3">
              <Detail label="Name" value={request.studentName} />
              <Detail label="Email" value={request.studentEmail} />
              <Detail label="Course" value={request.studentCourse} />
              <Detail label="Department" value={request.studentDepartment} />
            </dl>
          </div>
          {request.issuedDocumentId && (
            <div className="card p-6">
              <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Issued Document</h3>
              <div className="rounded-lg border border-success-100 bg-success-50 p-4">
                <CheckCircle2 className="h-8 w-8 text-success-600" />
                <p className="mt-2 text-sm font-medium text-success-700">Document Ready</p>
                <p className="mt-1 text-xs text-success-600">Your document has been generated and is available for download.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-navy-900">{value}</dd>
    </div>
  );
}
