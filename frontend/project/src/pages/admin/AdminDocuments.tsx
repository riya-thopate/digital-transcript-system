import { useEffect, useState, useCallback } from 'react';
import { getAllDocuments } from '@/services/adminApi';
import { downloadDocument } from '@/services/documentApi';
import type { Document, PaginatedResponse } from '@/types';
import { DocumentStatusBadge } from '@/components/ui/StatusBadge';
import { SearchBar } from '@/components/ui/SearchBar';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { documentTypeLabels } from '@/mocks/data';
import { formatDate, formatFileSize } from '@/utils/helpers';
import { FolderOpen, Download, FileText } from 'lucide-react';

export function AdminDocuments() {
  const [data, setData] = useState<PaginatedResponse<Document> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getAllDocuments({ search })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDownload = async (doc: Document) => {
    setDownloadingId(doc.id);
    try {
      const blob = await downloadDocument(doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">Document Management</h2>
        <p className="mt-1 text-sm text-slate-500">View and manage all issued documents.</p>
      </div>

      <div className="card p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by document ID, student name, or type..." />
      </div>

      {loading ? (
        <LoadingState message="Loading documents..." />
      ) : error ? (
        <ErrorState message="Failed to load documents." onRetry={load} />
      ) : data && data.content.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Document ID</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Document Type</th>
                <th className="px-4 py-3 font-medium">Issue Date</th>
                <th className="px-4 py-3 font-medium">File Size</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.content.map((doc) => (
                <tr key={doc.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-navy-800">{doc.documentRef}</td>
                  <td className="px-4 py-3 text-slate-600">{doc.studentName}</td>
                  <td className="px-4 py-3 text-slate-600">{documentTypeLabels[doc.documentType]}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(doc.issueDate)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatFileSize(doc.fileSize)}</td>
                  <td className="px-4 py-3"><DocumentStatusBadge status={doc.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id || doc.status !== 'ISSUED'}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50 disabled:opacity-40"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {downloadingId === doc.id ? 'Downloading...' : 'Download'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={FolderOpen} title="No documents found" description="No issued documents match your search." />
      )}
    </div>
  );
}
