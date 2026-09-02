import { useState } from 'react';
import { verifyCertificate } from '@/services/verificationApi';
import type { VerificationResponse } from '@/types';
import { Search, ShieldCheck, ShieldX, Loader2, GraduationCap, FileText, Calendar, Building2, QrCode, Hash } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { documentTypeLabels } from '@/mocks/data';

export function VerifyPage() {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await verifyCertificate(certificateId);
      setResult(res);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-navy-900 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-navy-800">
            <ShieldCheck className="h-7 w-7 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Certificate Verification
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-navy-300">
            Verify the authenticity of any certificate issued by our institution.
            Enter the certificate ID below — no account required.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
        {/* Search */}
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleVerify}>
            <label className="label" htmlFor="certId">Certificate / Document ID</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="certId"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="e.g., CERT-2024-BNF-00123"
                  className="input pl-10"
                />
              </div>
              <button type="submit" disabled={loading || !certificateId.trim()} className="btn btn-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Verify
              </button>
            </div>
          </form>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
            <QrCode className="h-4 w-4" />
            Tip: You can also scan a QR code on a physical certificate — it will link here with the ID pre-filled.
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="mt-6">
            {loading ? null : result?.valid ? (
              <ValidResult result={result} />
            ) : (
              <InvalidResult id={certificateId} />
            )}
          </div>
        )}

        {/* Demo hint */}
        {!searched && (
          <div className="mt-6 rounded-lg border border-navy-200 bg-navy-50 px-4 py-3 text-sm text-navy-700">
            <p className="font-medium">Try a demo ID:</p>
            <p className="mt-1 text-navy-600">CERT-2024-BNF-00123 — a valid bonafide certificate</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ValidResult({ result }: { result: VerificationResponse }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-success-50 px-6 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
          <ShieldCheck className="h-6 w-6 text-success-700" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-success-700">Certificate Verified</h3>
          <p className="text-sm text-success-600">This certificate is authentic and currently valid.</p>
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
        <Detail icon={Hash} label="Certificate ID" value={result.certificateId} />
        <Detail icon={FileText} label="Document Type" value={result.documentType ? documentTypeLabels[result.documentType] : '—'} />
        <Detail icon={Calendar} label="Issue Date" value={result.issueDate ? formatDate(result.issueDate) : '—'} />
        <Detail icon={GraduationCap} label="Student Name" value={result.studentName ?? '—'} />
        <Detail icon={Building2} label="Course" value={result.studentCourse ?? '—'} />
        <Detail icon={Building2} label="Department" value={result.studentDepartment ?? '—'} />
        <Detail icon={Building2} label="Institution" value={result.institution} />
        <Detail icon={ShieldCheck} label="Status" value={result.status ?? 'Issued'} />
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
        Verified on {formatDate(result.verifiedAt)} — This verification is for reference only. For official use, contact the institution directly.
      </div>
    </div>
  );
}

function InvalidResult({ id }: { id: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-error-50 px-6 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100">
          <ShieldX className="h-6 w-6 text-error-700" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-error-700">Certificate Not Found</h3>
          <p className="text-sm text-error-600">
            No valid certificate was found for ID "{id}".
          </p>
        </div>
      </div>
      <div className="p-6 text-sm text-slate-600">
        <p>The certificate ID you entered could not be verified. This may mean:</p>
        <ul className="mt-3 space-y-1.5 pl-4">
          <li className="list-disc">The ID was entered incorrectly — please check and try again.</li>
          <li className="list-disc">The certificate has been revoked or expired.</li>
          <li className="list-disc">The certificate was not issued by this institution.</li>
        </ul>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Hash; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-navy-50">
        <Icon className="h-4.5 w-4.5 text-navy-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-navy-900">{value}</p>
      </div>
    </div>
  );
}

