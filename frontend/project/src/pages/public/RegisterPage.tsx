import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Hash,
  Building2,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type RegistrationRole = 'STUDENT' | 'ADMIN';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState<RegistrationRole>('STUDENT');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    course: '',
    department: '',
    yearOfStudy: 'Year 1',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (newRole: RegistrationRole) => {
    setRole(newRole);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Please enter your first name and last name.');
      return;
    }

    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!form.password) {
      setError('Please enter a password.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'STUDENT') {
      if (
        !form.studentId.trim() ||
        !form.course.trim() ||
        !form.department.trim()
      ) {
        setError(
          'Student ID, Course and Department are required for student registration.',
        );
        return;
      }
    }

    try {
      setLoading(true);

      const user = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        studentId:
          role === 'STUDENT'
            ? form.studentId.trim()
            : `ADMIN-${Date.now()}`,
        course:
          role === 'STUDENT'
            ? form.course.trim()
            : 'Administration',
        department:
          role === 'STUDENT'
            ? form.department.trim()
            : 'Administration',
        yearOfStudy:
          role === 'STUDENT'
            ? form.yearOfStudy
            : 'N/A',
        role,
      });

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden bg-navy-900 lg:flex lg:flex-col lg:justify-between p-12">
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 text-white"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-800">
                <GraduationCap className="h-6 w-6 text-yellow-400" />
              </div>

              <span className="font-serif text-xl font-bold">
                Digital Transcript System
              </span>
            </Link>
          </div>

          <div className="max-w-xl">
            <h1 className="font-serif text-4xl font-bold leading-tight text-white">
              Create your academic portal account
            </h1>

            <p className="mt-5 text-lg leading-7 text-blue-200">
              Register as a student or administrator to access
              the Digital Transcript & Certificate Issuance System.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-blue-200">
                <ShieldCheck className="h-5 w-5 text-yellow-400" />
                Secure academic record access
              </div>

              <div className="flex items-center gap-3 text-blue-200">
                <GraduationCap className="h-5 w-5 text-yellow-400" />
                Request and manage official documents
              </div>

              <div className="flex items-center gap-3 text-blue-200">
                <User className="h-5 w-5 text-yellow-400" />
                Role-based student and admin access
              </div>
            </div>
          </div>

          <p className="text-sm text-blue-300">
            © 2026 National Institute of Technology
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-2xl">

            {/* Back */}
            <Link
              to="/login"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            <div className="mb-7">
              <h2 className="font-serif text-3xl font-bold text-navy-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Select your account type and complete the registration.
              </p>
            </div>

            {/* ROLE SELECTION */}
            <div className="mb-7">
              <p className="mb-3 text-sm font-semibold text-navy-900">
                Register as
              </p>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => handleRoleChange('STUDENT')}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === 'STUDENT'
                      ? 'border-navy-600 bg-navy-50 ring-2 ring-navy-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <GraduationCap className="h-5 w-5 text-blue-700" />
                    </div>

                    <div>
                      <p className="font-semibold text-navy-900">
                        Student
                      </p>
                      <p className="text-xs text-slate-500">
                        Request documents
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === 'ADMIN'
                      ? 'border-navy-600 bg-navy-50 ring-2 ring-navy-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                      <ShieldCheck className="h-5 w-5 text-yellow-700" />
                    </div>

                    <div>
                      <p className="font-semibold text-navy-900">
                        Administrator
                      </p>
                      <p className="text-xs text-slate-500">
                        Manage requests
                      </p>
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    First Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) =>
                        updateField('firstName', e.target.value)
                      }
                      placeholder="Arjun"
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      updateField('lastName', e.target.value)
                    }
                    placeholder="Sharma"
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 px-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                    required
                  />
                </div>

              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-navy-900">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField('email', e.target.value)
                    }
                    placeholder="you@college.edu"
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                    required
                  />
                </div>
              </div>

              {/* STUDENT ONLY FIELDS */}
              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-900">
                      Student ID
                    </label>

                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={form.studentId}
                        onChange={(e) =>
                          updateField('studentId', e.target.value)
                        }
                        placeholder="CS20B001"
                        className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-medium text-navy-900">
                        Course
                      </label>

                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={form.course}
                          onChange={(e) =>
                            updateField('course', e.target.value)
                          }
                          placeholder="B.Tech Computer Science"
                          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-navy-900">
                        Department
                      </label>

                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={form.department}
                          onChange={(e) =>
                            updateField('department', e.target.value)
                          }
                          placeholder="Computer Science & Engineering"
                          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                          required
                        />
                      </div>
                    </div>

                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-900">
                      Year of Study
                    </label>

                    <select
                      value={form.yearOfStudy}
                      onChange={(e) =>
                        updateField('yearOfStudy', e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 px-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                    >
                      <option>Year 1</option>
                      <option>Year 2</option>
                      <option>Year 3</option>
                      <option>Year 4</option>
                    </select>
                  </div>
                </>
              )}

              {/* ADMIN INFORMATION */}
              {role === 'ADMIN' && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-700" />

                    <div>
                      <p className="font-semibold text-yellow-900">
                        Administrator Account
                      </p>

                      <p className="mt-1 text-sm text-yellow-800">
                        This account will have access to the administration
                        dashboard, student requests, students, documents,
                        notifications and audit logs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        updateField('password', e.target.value)
                      }
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-navy-900">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateField('confirmPassword', e.target.value)
                    }
                    placeholder="Re-enter password"
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 px-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                    required
                  />
                </div>

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-navy-800 py-3.5 font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Creating Account...'
                  : role === 'STUDENT'
                    ? 'Create Student Account'
                    : 'Create Admin Account'}
              </button>

            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-navy-800 hover:text-navy-600"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}