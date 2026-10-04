import { useState } from 'react';
import type { CreateDocumentRequest, DocumentType } from '@/types';
import { FileUpload } from './FileUpload';
import { Loader2, Send } from 'lucide-react';
import { toast } from './Toast';

const documentTypeLabels: Record<DocumentType, string> = {
  TRANSCRIPT: 'Official Transcript',
  CERTIFICATE: 'Degree Certificate',
  PROVISIONAL_CERTIFICATE: 'Provisional Certificate',
  MARKSHEET: 'Marksheet',
  BONAFIDE: 'Bonafide Certificate',
  MIGRATION: 'Migration Certificate',
};

const docTypeOptions = Object.entries(documentTypeLabels) as [DocumentType, string][];

interface FormErrors {
  documentType?: string;
  purpose?: string;
  numberOfCopies?: string;
  files?: string;
}

export function RequestForm({
  onSubmit,
}: {
  onSubmit: (data: CreateDocumentRequest) => Promise<void>;
}) {
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [purpose, setPurpose] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!documentType) e.documentType = 'Please select a document type';
    if (!purpose.trim()) e.purpose = 'Purpose is required';
    else if (purpose.trim().length < 10) e.purpose = 'Purpose must be at least 10 characters';
    if (numberOfCopies < 1) e.numberOfCopies = 'At least 1 copy is required';
    if (numberOfCopies > 10) e.numberOfCopies = 'Maximum 10 copies per request';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        documentType: documentType as DocumentType,
        purpose: purpose.trim(),
        numberOfCopies,
        additionalInfo: additionalInfo.trim() || undefined,
        supportingDocuments: files,
      });
      setSuccess(true);
      toast('success', 'Request submitted', 'Your document request has been submitted successfully.');
      setDocumentType('');
      setPurpose('');
      setNumberOfCopies(1);
      setAdditionalInfo('');
      setFiles([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit request';
      toast('error', 'Submission failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-success-100 bg-success-50 px-4 py-3 text-sm text-success-700">
          <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Request submitted successfully. You can track its status from your dashboard.</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="docType">Document Type <span className="text-error-600">*</span></label>
          <select
            id="docType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            className={`input ${errors.documentType ? 'border-error-500' : ''}`}
          >
            <option value="">Select a document type</option>
            {docTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.documentType && <p className="mt-1 text-xs text-error-600">{errors.documentType}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="purpose">Purpose <span className="text-error-600">*</span></label>
          <textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            placeholder="Explain why you need this document (e.g., higher studies, job application, visa)..."
            className={`input ${errors.purpose ? 'border-error-500' : ''}`}
          />
          {errors.purpose && <p className="mt-1 text-xs text-error-600">{errors.purpose}</p>}
        </div>

        <div>
          <label className="label" htmlFor="copies">Number of Copies <span className="text-error-600">*</span></label>
          <input
            id="copies"
            type="number"
            min={1}
            max={10}
            value={numberOfCopies}
            onChange={(e) => setNumberOfCopies(parseInt(e.target.value) || 0)}
            className={`input ${errors.numberOfCopies ? 'border-error-500' : ''}`}
          />
          {errors.numberOfCopies && <p className="mt-1 text-xs text-error-600">{errors.numberOfCopies}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="additional">Additional Information</label>
          <textarea
            id="additional"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={2}
            placeholder="Any special instructions (e.g., sealed envelope, attestation required)..."
            className="input"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Supporting Documents</label>
          <FileUpload files={files} onChange={setFiles} />
          <p className="mt-1.5 text-xs text-slate-500">
            Upload any supporting documents (application letter, ID proof, etc.)
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Request
            </>
          )}
        </button>
      </div>
    </form>
  );
}
