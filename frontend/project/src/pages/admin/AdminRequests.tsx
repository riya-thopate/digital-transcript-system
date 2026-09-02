import { useEffect, useState, useCallback } from 'react';
import { getAllRequests } from '@/services/adminApi';
import type { DocumentRequest, RequestStatus, DocumentType, PaginatedResponse } from '@/types';
import { RequestTable } from '@/components/ui/RequestTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterPanel } from '@/components/ui/FilterPanel';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { documentTypeLabels, requestStatusLabels } from '@/mocks/data';
import { FileSearch } from 'lucide-react';

export function AdminRequests() {
  const [data, setData] = useState<PaginatedResponse<DocumentRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ status?: string; documentType?: string }>({});

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getAllRequests({
      page,
      size: 10,
      search,
      status: filters.status as RequestStatus | undefined,
      documentType: filters.documentType as DocumentType | undefined,
    })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [page, search, filters]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">Request Management</h2>
        <p className="mt-1 text-sm text-slate-500">Review and manage all student document requests.</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-4">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(0); }} placeholder="Search by request ID, student name, or email..." />
          <FilterPanel
            filters={[
              {
                key: 'status',
                label: 'Status',
                options: Object.entries(requestStatusLabels).map(([value, label]) => ({ value, label })),
              },
              {
                key: 'documentType',
                label: 'Document Type',
                options: Object.entries(documentTypeLabels).map(([value, label]) => ({ value, label })),
              },
            ]}
            values={filters}
            onChange={(key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(0); }}
            onReset={() => { setFilters({}); setPage(0); }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading requests..." />
      ) : error ? (
        <ErrorState message="Failed to load requests." onRetry={load} />
      ) : data && data.content.length > 0 ? (
        <>
          <RequestTable requests={data.content} basePath="/admin/requests" showStudent />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState
          icon={FileSearch}
          title="No requests found"
          description="No document requests match your search or filters."
        />
      )}
    </div>
  );
}
