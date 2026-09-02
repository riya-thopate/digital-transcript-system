import { getDemoStudent } from '@/services/authApi';
import type { Student } from '@/types';
import { useEffect, useState } from 'react';
import { LoadingState } from '@/components/ui/LoadingState';
import { User, Mail, Phone, Building2, Calendar, Hash, MapPin, GraduationCap } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export function StudentProfile() {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    setStudent(getDemoStudent());
  }, []);

  if (!student) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-navy-800 to-navy-600" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white bg-gold-500 text-2xl font-bold text-navy-900">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="pb-2">
              <h2 className="font-serif text-xl font-bold text-navy-900">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm text-slate-500">{student.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Personal Information</h3>
          <dl className="space-y-3">
            <Row icon={Hash} label="Student ID" value={student.studentId} />
            <Row icon={User} label="Full Name" value={`${student.firstName} ${student.lastName}`} />
            <Row icon={Mail} label="Email" value={student.email} />
            <Row icon={Phone} label="Phone" value={student.phone ?? '—'} />
            <Row icon={Calendar} label="Date of Birth" value={student.dateOfBirth ? formatDate(student.dateOfBirth) : '—'} />
            <Row icon={MapPin} label="Address" value={student.address ?? '—'} />
          </dl>
        </div>
        <div className="card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">Academic Information</h3>
          <dl className="space-y-3">
            <Row icon={GraduationCap} label="Course" value={student.course} />
            <Row icon={Building2} label="Department" value={student.department} />
            <Row icon={Calendar} label="Year of Study" value={`Year ${student.yearOfStudy}`} />
            <Row icon={Calendar} label="Enrollment Year" value={String(student.enrollmentYear)} />
            <Row icon={User} label="Status" value={student.status} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
      <dt className="flex items-center gap-2.5 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-navy-500" />
        {label}
      </dt>
      <dd className="text-sm font-medium text-navy-900">{value}</dd>
    </div>
  );
}
