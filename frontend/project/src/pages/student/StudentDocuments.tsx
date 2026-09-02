import { useEffect, useState } from 'react';
import { getMyDocuments, downloadDocument } from '@/services/documentApi';
import type { Document } from '@/types';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { FolderOpen, FileText } from 'lucide-react';

export function StudentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    getMyDocuments()
      .then((res) => setDocuments(res.content))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <LoadingState message="Loading documents..." />;
  if (error) return <ErrorState message="Failed to load documents." onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">My Documents</h2>
        <p className="mt-1 text-sm text-slate-500">Download your issued transcripts and certificates.</p>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents yet"
          description="Your issued documents will appear here once they are approved and generated."
        />
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-lg border border-navy-200 bg-navy-50 px-4 py-3 text-sm text-navy-700">
            <FileText className="h-4 w-4" />
            You have {documents.length} document{documents.length !== 1 ? 's' : ''} available for download.
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDownload={() => handleDownload(doc)}
                downloading={downloadingId === doc.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
