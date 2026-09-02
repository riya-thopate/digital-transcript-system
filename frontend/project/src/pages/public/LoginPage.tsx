import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Mail, Lock, Loader2, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export function LoginPage() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: string) => {
    navigate(role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      toast('success', 'Welcome back!');
      if (from) navigate(from, { replace: true });
      else redirectByRole(email.includes('admin') ? 'ADMIN' : 'STUDENT');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'STUDENT' | 'ADMIN') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      toast('success', `Logged in as demo ${role.toLowerCase()}`);
      redirectByRole(role);
    } catch {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-navy-900 p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
            <GraduationCap className="h-5 w-5 text-gold-400" />
          </div>
          <span className="font-serif text-lg font-semibold text-white">Digital Transcript System</span>
        </Link>
        <div>
          <h2 className="font-serif text-3xl font-bold text-white">
            Welcome back to your<br />academic portal
          </h2>
          <p className="mt-4 max-w-md text-navy-300">
            Login to request official transcripts and certificates, track your
            requests, and download verified documents.
          </p>
          <div className="mt-8 space-y-3">
            {['Secure access to academic records', 'Real-time request tracking', 'Instant document downloads'].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-navy-200">
                <ShieldCheck className="h-4 w-4 text-gold-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-navy-400">&copy; {new Date().getFullYear()} National Institute of Technology</p>
      </div>

      {/* Right form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
                <GraduationCap className="h-5 w-5 text-gold-400" />
              </div>
              <span className="font-serif text-lg font-semibold text-navy-900">Digital Transcript System</span>
            </Link>
          </div>

          <h1 className="font-serif text-2xl font-bold text-navy-900">Sign in to your account</h1>
          <p className="mt-1.5 text-sm text-slate-500">Enter your credentials to access the portal.</p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-600">Demo accounts (click to login):</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleDemo('STUDENT')}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                <User className="h-3.5 w-3.5" /> Student Demo
              </button>
              <button
                onClick={() => handleDemo('ADMIN')}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Admin Demo
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Or use: student@college.edu / admin@college.edu — password: password123
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-navy-700 hover:text-navy-900">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
