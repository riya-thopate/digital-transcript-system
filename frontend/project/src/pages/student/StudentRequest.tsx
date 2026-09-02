import { createRequest } from '@/services/requestApi';
import { RequestForm } from '@/components/ui/RequestForm';
import type { CreateDocumentRequest } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

export function StudentRequest() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateDocumentRequest) => {
    await createRequest(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">New Document Request</h2>
        <p className="mt-1 text-sm text-slate-500">
          Fill out the form below to request an official academic document.
        </p>
      </div>

      <div className="rounded-lg border border-navy-200 bg-navy-50 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-navy-600" />
          <div className="text-sm text-navy-700">
            <p className="font-medium">Before you submit</p>
            <p className="mt-1 text-navy-600">
              Ensure your personal and academic information is up to date. Processing
              typically takes 3-5 working days. You'll receive a notification when
              your request is reviewed.
            </p>
          </div>
        </div>
      </div>

      <RequestForm onSubmit={handleSubmit} />

      <div className="text-center">
        <button
          onClick={() => navigate('/student/requests')}
          className="text-sm font-medium text-navy-600 hover:text-navy-800"
        >
          View my requests
        </button>
      </div>
    </div>
  );
}
