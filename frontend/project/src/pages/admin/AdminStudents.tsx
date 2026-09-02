import { useEffect, useState, useCallback } from 'react';
import { getAllStudents } from '@/services/adminApi';
import type { Student, PaginatedResponse } from '@/types';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';
import { mockStudents } from '@/mocks/data';

const departments = [...new Set(mockStudents.map((s) => s.department))];

export function AdminStudents() {
  const [data, setData] = useState<PaginatedResponse<Student> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getAllStudents({ page, size: 10, search, department })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [page, search, department]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">Student Management</h2>
        <p className="mt-1 text-sm text-slate-500">View and manage all registered students.</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(0); }} placeholder="Search by name, student ID, or email..." />
          </div>
          <div className="min-w-[200px]">
            <select value={department} onChange={(e) => { setDepartment(e.target.value); setPage(0); }} className="input">
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading students..." />
      ) : error ? (
        <ErrorState message="Failed to load students." onRetry={load} />
      ) : data && data.content.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Student ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.content.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-navy-800">{s.studentId}</td>
                    <td className="px-4 py-3 font-medium text-navy-800">{s.firstName} {s.lastName}</td>
                    <td className="px-4 py-3 text-slate-600">{s.email}</td>
                    <td className="px-4 py-3 text-slate-600">{s.course}</td>
                    <td className="px-4 py-3 text-slate-600">{s.department}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        s.status === 'ACTIVE' ? 'bg-success-50 text-success-700 border-success-100' :
                        s.status === 'GRADUATED' ? 'bg-navy-50 text-navy-700 border-navy-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={Users} title="No students found" description="No students match your search or filters." />
      )}
    </div>
  );
}
