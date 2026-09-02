import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getAllRequests, getAuditLogs } from '@/services/adminApi';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { RequestTable } from '@/components/ui/RequestTable';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { DocumentRequest, AuditLog } from '@/types';
import { FileText, Clock, FileSearch, FileCheck2, FileX2, FileText as DocIcon, ArrowRight, ScrollText } from 'lucide-react';
import { formatRelative } from '@/utils/helpers';
import { requestStatusLabels } from '@/mocks/data';

interface Stats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  documentGenerated: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRequests, setRecentRequests] = useState<DocumentRequest[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getAllRequests({ size: 5 }),
      getAuditLogs({ size: 5 }),
    ])
      .then(([s, reqs, logs]) => {
        setStats(s);
        setRecentRequests(reqs.content);
        setRecentLogs(logs.content);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error || !stats) return <ErrorState message="Failed to load dashboard." onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Overview of all document requests and system activity.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <DashboardCard label="Total Requests" value={stats.total} icon={FileText} color="navy" to="/admin/requests" />
        <DashboardCard label="Pending" value={stats.pending} icon={Clock} color="warning" to="/admin/requests" />
        <DashboardCard label="Under Review" value={stats.underReview} icon={FileSearch} color="blue" to="/admin/requests" />
        <DashboardCard label="Approved" value={stats.approved} icon={FileCheck2} color="success" to="/admin/requests" />
        <DashboardCard label="Rejected" value={stats.rejected} icon={FileX2} color="error" to="/admin/requests" />
        <DashboardCard label="Documents Generated" value={stats.documentGenerated} icon={DocIcon} color="gold" to="/admin/documents" />
      </div>

      {/* Recent + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-navy-900">Recent Requests</h3>
            <Link to="/admin/requests" className="text-sm font-medium text-navy-600 hover:text-navy-800">
              View all
            </Link>
          </div>
          <RequestTable requests={recentRequests} basePath="/admin/requests" showStudent />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-navy-900">Recent Activity</h3>
            <Link to="/admin/audit-logs" className="text-sm font-medium text-navy-600 hover:text-navy-800">
              View all
            </Link>
          </div>
          <div className="card divide-y divide-slate-100">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-4 py-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-100">
                  <ScrollText className="h-4 w-4 text-navy-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy-900">{log.userName}</p>
                  <p className="text-xs text-slate-500">
                    {log.action.replace(/_/g, ' ').toLowerCase()} — {log.entityId}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{formatRelative(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="card p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Request Status Overview</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(requestStatusLabels).map(([status, label]) => {
            const count = recentRequests.filter(
              (r) => r.status === status,
            ).length;
            return (
              <Link
                key={status}
                to="/admin/requests"
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-navy-300 hover:bg-navy-50/40"
              >
                <span className="text-sm font-medium text-navy-800">{label}</span>
                <span className="flex items-center gap-2 text-sm font-bold text-navy-900">
                  {count}
                  <ArrowRight className="h-3.5 w-3.5 text-navy-400" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
