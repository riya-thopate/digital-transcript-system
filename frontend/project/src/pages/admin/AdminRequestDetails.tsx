import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getAdminRequestById,
  approveRequest,
  rejectRequest,
  addRemark,
  generateDocument,
  markAvailable,
} from '@/services/adminApi';
import type { DocumentRequest } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { toast } from '@/components/ui/Toast';
import { documentTypeLabels, requestStatusLabels } from '@/mocks/data';
import { formatDateTime, formatFileSize } from '@/utils/helpers';
import {
  ArrowLeft, FileText, Clock, CheckCircle2, X, MessageSquare, Paperclip, User,
  ThumbsUp, ThumbsDown, FilePlus, CheckCircle, Loader2,
} from 'lucide-react';

type DialogState =
  | { type: 'approve' }
  | { type: 'reject' }
  | { type: 'remark' }
  | { type: 'generate' }
  | { type: 'available' }
  | null;

export function AdminRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarkText, setRemarkText] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (!id) return;
    loadRequest();
  }, [id]);

  const loadRequest = () => {
    if (!id) return;
    setLoading(true);
    getAdminRequestById(id)
      .then(setRequest)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const handleAction = async () => {
    if (!request || !dialog) return;
    setActionLoading(true);
    try {
      if (dialog.type === 'approve') {
        await approveRequest(request.id, remarkText || undefined);
        toast('success', 'Request approved');
      } else if (dialog.type === 'reject') {
        await rejectRequest(request.id, rejectReason);
        toast('success', 'Request rejected');
      } else if (dialog.type === 'remark') {
        await addRemark(request.id, remarkText);
        toast('success', 'Remark added');
      } else if (dialog.type === 'generate') {
        await generateDocument(request.id);
        toast('success', 'Document generated');
      } else if (dialog.type === 'available') {
        await markAvailable(request.id);
        toast('success', 'Document marked as available');
      }
      setDialog(null);
      setRemarkText('');
      setRejectReason('');
      loadRequest();
    } catch (err) {
      toast('error', 'Action failed', err instanceof Error ? err.message : undefined);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading request..." />;
  if (error || !request) return <ErrorState message="Request not found." onRetry={() => navigate('/admin/requests')} />;

  const canApprove = request.status === 'PENDING' || request.status === 'UNDER_REVIEW';
  const canReject = request.status === 'PENDING' || request.status === 'UNDER_REVIEW';
  const canGenerate = request.status === 'APPROVED';
  const canMarkAvailable = request.status === 'DOCUMENT_GENERATED';

  return (
    <div className="space-y-6">
      <Link to="/admin/requests" className="flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-800">
        <ArrowLeft className="h-4 w-4" />
        Back to requests
      </Link>

      <div className="card p-6">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl font-bold text-navy-900">{request.requestRef}</h2>
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{documentTypeLabels[request.documentType]}</p>
          </div>
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {canApprove && (
              <button onClick={() => { setRemarkText(''); setDialog({ type: 'approve' }); }} className="btn btn-primary">
                <ThumbsUp className="h-4 w-4" /> Approve
              </button>
            )}
            {canReject && (
              <button onClick={() => { setRejectReason(''); setDialog({ type: 'reject' }); }} className="btn btn-danger">
                <ThumbsDown className="h-4 w-4" /> Reject
              </button>
            )}
            <button onClick={() => { setRemarkText(''); setDialog({ type: 'remark' }); }} className="btn btn-secondary">
              <MessageSquare className="h-4 w-4" /> Add Remark
            </button>
            {canGenerate && (
              <button onClick={() => setDialog({ type: 'generate' })} className="btn btn-gold">
                <FilePlus className="h-4 w-4" /> Generate Document
              </button>
            )}
            {canMarkAvailable && (
              <button onClick={() => setDialog({ type: 'available' })} className="btn btn-primary">
                <CheckCircle className="h-4 w-4" /> Mark Available
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Student Info */}
          <div className="card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Student Details</h3>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Detail label="Name" value={request.studentName} />
              <Detail label="Email" value={request.studentEmail} />
              <Detail label="Course" value={request.studentCourse} />
              <Detail label="Department" value={request.studentDepartment} />
            </dl>
          </div>

          {/* Request Details */}
          <div className="card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Request Details</h3>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Detail label="Document Type" value={documentTypeLabels[request.documentType]} />
              <Detail label="Number of Copies" value={String(request.numberOfCopies)} />
              <Detail label="Submitted" value={formatDateTime(request.submittedAt)} />
              <Detail label="Last Updated" value={formatDateTime(request.updatedAt)} />
              <div className="sm:col-span-2"><Detail label="Purpose" value={request.purpose} /></div>
              {request.additionalInfo && (
                <div className="sm:col-span-2"><Detail label="Additional Information" value={request.additionalInfo} /></div>
              )}
            </dl>
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

          {/* Remarks */}
          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-navy-900">
              <MessageSquare className="h-5 w-5 text-navy-600" />
              Remarks
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
      </div>

      {/* Dialogs */}
      <ConfirmationDialog
        open={dialog?.type === 'approve'}
        title="Approve Request"
        message="Are you sure you want to approve this request? The student will be notified."
        confirmLabel="Approve"
        onConfirm={handleAction}
        onCancel={() => setDialog(null)}
      >
        <div className="mt-3">
          <label className="label">Remark (optional)</label>
          <textarea value={remarkText} onChange={(e) => setRemarkText(e.target.value)} rows={2} className="input" placeholder="Add a note for the student..." />
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={dialog?.type === 'reject'}
        title="Reject Request"
        message="Are you sure you want to reject this request? The student will be notified."
        confirmLabel="Reject"
        variant="danger"
        onConfirm={handleAction}
        onCancel={() => setDialog(null)}
      >
        <div className="mt-3">
          <label className="label">Reason for rejection <span className="text-error-600">*</span></label>
          <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="input" placeholder="Explain why the request is being rejected..." />
          {!rejectReason && actionLoading && <p className="mt-1 text-xs text-error-600">Please provide a reason.</p>}
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={dialog?.type === 'remark'}
        title="Add Remark"
        onConfirm={handleAction}
        onCancel={() => setDialog(null)}
        confirmLabel="Add Remark"
      >
        <div className="mt-3">
          <label className="label">Remark</label>
          <textarea value={remarkText} onChange={(e) => setRemarkText(e.target.value)} rows={3} className="input" placeholder="Enter your remark..." />
        </div>
      </ConfirmationDialog>

      <ConfirmationDialog
        open={dialog?.type === 'generate'}
        title="Generate Document"
        message="This will generate the official document and mark the request as 'Document Generated'."
        confirmLabel="Generate"
        variant="gold"
        onConfirm={handleAction}
        onCancel={() => setDialog(null)}
      />

      <ConfirmationDialog
        open={dialog?.type === 'available'}
        title="Mark Document Available"
        message="This will make the document available for the student to download."
        confirmLabel="Mark Available"
        onConfirm={handleAction}
        onCancel={() => setDialog(null)}
      />

      {actionLoading && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm text-white shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      )}
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
