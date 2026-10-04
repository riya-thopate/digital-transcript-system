import type { User as AppUser } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  User as UserIcon,
  Mail,
  Building2,
  Calendar,
  Hash,
  GraduationCap,
} from 'lucide-react';

export function StudentProfile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <div className="card p-6">
        <p className="text-sm text-slate-500">
          Unable to load profile. Please log in again.
        </p>
      </div>
    );
  }

  return <ProfileContent user={user} />;
}

function ProfileContent({ user }: { user: AppUser }) {
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';

  const initials =
    `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  const fullName =
    user.name || `${firstName} ${lastName}`.trim();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-navy-800 to-navy-600" />

        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white bg-gold-500 text-2xl font-bold text-navy-900">
              {initials || '?'}
            </div>

            <div className="pb-2">
              <h2 className="font-serif text-xl font-bold text-navy-900">
                {fullName}
              </h2>

              <p className="text-sm text-slate-500">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Personal Information */}
        <div className="card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">
            Personal Information
          </h3>

          <dl className="space-y-3">
            <Row
              icon={Hash}
              label="Student ID"
              value={user.studentId || '—'}
            />

            <Row
              icon={UserIcon}
              label="Full Name"
              value={fullName}
            />

            <Row
              icon={Mail}
              label="Email"
              value={user.email || '—'}
            />
          </dl>
        </div>

        {/* Academic Information */}
        <div className="card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-navy-900">
            Academic Information
          </h3>

          <dl className="space-y-3">
            <Row
              icon={GraduationCap}
              label="Course"
              value={user.course || '—'}
            />

            <Row
              icon={Building2}
              label="Department"
              value={user.department || '—'}
            />

            <Row
              icon={Calendar}
              label="Year of Study"
              value={
                user.yearOfStudy
                  ? `Year ${user.yearOfStudy}`
                  : '—'
              }
            />

            <Row
              icon={UserIcon}
              label="Role"
              value={user.role || '—'}
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
      <dt className="flex items-center gap-2.5 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-navy-500" />
        {label}
      </dt>

      <dd className="text-right text-sm font-medium text-navy-900">
        {value}
      </dd>
    </div>
  );
}