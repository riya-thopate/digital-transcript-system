import { useEffect, useState, useCallback } from 'react';
import { getAuditLogs } from '@/services/adminApi';
import type { AuditLog, PaginatedResponse } from '@/types';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateTime } from '@/utils/helpers';
import { ScrollText, User, FileText, ShieldCheck, CheckCircle2, FileX2, FilePlus, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const actionIcons: Record<string, LucideIcon> = {
  APPROVE_REQUEST: CheckCircle2,
  REJECT_REQUEST: FileX2,
  GENERATE_DOCUMENT: FilePlus,
  MARK_AVAILABLE: CheckCircle2,
  ADD_REMARK: MessageSquare,
  SUBMIT_REQUEST: FileText,
};

const actionOptions = [
  'APPROVE_REQUEST',
  'REJECT_REQUEST',
  'GENERATE_DOCUMENT',
  'MARK_AVAILABLE',
  'ADD_REMARK',
  'SUBMIT_REQUEST',
];

export function AdminAuditLogs() {
  const [data, setData] = useState<PaginatedResponse<AuditLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getAuditLogs({ page, size: 10, search, action })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [page, search, action]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">Audit Logs</h2>
        <p className="mt-1 text-sm text-slate-500">Complete record of all system actions and activities.</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(0); }} placeholder="Search by user, action, or entity ID..." />
          </div>
          <div className="min-w-[200px]">
            <select value={action} onChange={(e) => { setAction(e.target.value); setPage(0); }} className="input">
              <option value="">All Actions</option>
              {actionOptions.map((a) => (
                <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading audit logs..." />
      ) : error ? (
        <ErrorState message="Failed to load audit logs." onRetry={load} />
      ) : data && data.content.length > 0 ? (
        <>
          <div className="card divide-y divide-slate-100">
            {data.content.map((log) => {
              const Icon = actionIcons[log.action] ?? ScrollText;
              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-100">
                    <Icon className="h-5 w-5 text-navy-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-navy-900">{log.userName}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{log.userRole}</span>
                      <span className="text-sm text-slate-600">performed</span>
                      <span className="text-sm font-medium text-navy-800">{log.action.replace(/_/g, ' ').toLowerCase()}</span>
                    </div>
                    {log.details && <p className="mt-1 text-sm text-slate-500">{log.details}</p>}
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {log.entityType}: {log.entityId}</span>
                      {log.requestId && <span>Request: {log.requestId}</span>}
                      <span>{formatDateTime(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ScrollText} title="No audit logs found" description="No activity matches your search or filters." />
      )}
    </div>
  );
}
