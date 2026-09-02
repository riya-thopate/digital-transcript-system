import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Mail, Lock, User, AlertCircle, Loader2, Building2, Hash } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import type { RegisterRequest } from '@/types';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    studentId: '',
    course: '',
    department: '',
    yearOfStudy: 1,
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const update = (key: keyof RegisterRequest, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast('success', 'Account created!', 'Welcome to the Digital Transcript System.');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between bg-navy-900 p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
            <GraduationCap className="h-5 w-5 text-gold-400" />
          </div>
          <span className="font-serif text-lg font-semibold text-white">Digital Transcript System</span>
        </Link>
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">Create your student account</h2>
          <p className="mt-4 max-w-md text-navy-300">
            Register to request official transcripts and certificates, track
            your requests, and download verified documents online.
          </p>
        </div>
        <p className="text-xs text-navy-400">&copy; {new Date().getFullYear()} National Institute of Technology</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-serif text-2xl font-bold text-navy-900">Student Registration</h1>
          <p className="mt-1.5 text-sm text-slate-500">Create an account to get started.</p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="input pl-10" placeholder="Arjun" />
                </div>
              </div>
              <div>
                <label className="label">Last Name</label>
                <input required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="input" placeholder="Sharma" />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} className="input pl-10" placeholder="you@college.edu" />
              </div>
            </div>
            <div>
              <label className="label">Student ID</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input required value={form.studentId} onChange={(e) => update('studentId', e.target.value)} className="input pl-10" placeholder="CS20B001" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Course</label>
                <input required value={form.course} onChange={(e) => update('course', e.target.value)} className="input" placeholder="B.Tech Computer Science" />
              </div>
              <div>
                <label className="label">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input required value={form.department} onChange={(e) => update('department', e.target.value)} className="input pl-10" placeholder="Computer Science & Engg." />
                </div>
              </div>
            </div>
            <div>
              <label className="label">Year of Study</label>
              <select value={form.yearOfStudy} onChange={(e) => update('yearOfStudy', parseInt(e.target.value))} className="input">
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} className="input pl-10" placeholder="Min 6 characters" />
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" placeholder="Re-enter password" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-navy-700 hover:text-navy-900">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
