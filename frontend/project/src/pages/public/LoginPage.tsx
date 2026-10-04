import { useState } from 'react';
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

import {
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

import { toast } from '@/components/ui/Toast';

type LoginRole = 'STUDENT' | 'ADMIN';

export function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: string })?.from;

  const [role, setRole] = useState<LoginRole>('STUDENT');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // CHANGE LOGIN ROLE
  // =========================================================

  const handleRoleChange = (newRole: LoginRole) => {
    setRole(newRole);
    setError(null);
    setEmail('');
    setPassword('');
  };

  // =========================================================
  // REDIRECT ACCORDING TO DATABASE ROLE
  // =========================================================

  const redirectByRole = (userRole: string) => {
    if (userRole === 'ADMIN') {
      navigate('/admin/dashboard', {
        replace: true,
      });
    } else {
      navigate('/student/dashboard', {
        replace: true,
      });
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const loggedInUser = await login({
        email: email.trim(),
        password,
      });

      // -----------------------------------------------------
      // CHECK SELECTED LOGIN TYPE
      // -----------------------------------------------------

      if (
        role === 'ADMIN' &&
        loggedInUser.role !== 'ADMIN'
      ) {
        setError(
          'This account is not registered as an administrator.',
        );
        return;
      }

      if (
        role === 'STUDENT' &&
        loggedInUser.role !== 'STUDENT'
      ) {
        setError(
          'This account is not registered as a student.',
        );
        return;
      }

      toast(
        'success',
        `Welcome ${loggedInUser.firstName || loggedInUser.name}!`,
      );

      // -----------------------------------------------------
      // REDIRECT
      // -----------------------------------------------------

      if (from) {
        navigate(from, {
          replace: true,
        });
      } else {
        redirectByRole(loggedInUser.role);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* =====================================================
          LEFT PANEL
      ===================================================== */}

      <div className="relative hidden w-1/2 flex-col justify-between bg-navy-900 p-12 lg:flex">

        <Link
          to="/"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
            <GraduationCap className="h-5 w-5 text-gold-400" />
          </div>

          <span className="font-serif text-lg font-semibold text-white">
            Digital Transcript System
          </span>
        </Link>

        <div>

          <h2 className="font-serif text-3xl font-bold text-white">
            Welcome to your
            <br />
            academic portal
          </h2>

          <p className="mt-4 max-w-md text-navy-300">
            Access official transcripts and certificates,
            manage document requests, and track academic
            records securely.
          </p>

          <div className="mt-8 space-y-3">

            <div className="flex items-center gap-2.5 text-sm text-navy-200">
              <ShieldCheck className="h-4 w-4 text-gold-400" />
              Secure academic record access
            </div>

            <div className="flex items-center gap-2.5 text-sm text-navy-200">
              <ShieldCheck className="h-4 w-4 text-gold-400" />
              Real-time request tracking
            </div>

            <div className="flex items-center gap-2.5 text-sm text-navy-200">
              <ShieldCheck className="h-4 w-4 text-gold-400" />
              Role-based access control
            </div>

          </div>

        </div>

        <p className="text-xs text-navy-400">
          &copy; {new Date().getFullYear()} National Institute of Technology
        </p>

      </div>

      {/* =====================================================
          RIGHT PANEL
      ===================================================== */}

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">

        <div className="mx-auto w-full max-w-md">

          {/* MOBILE LOGO */}

          <div className="mb-8 lg:hidden">

            <Link
              to="/"
              className="flex items-center gap-2.5"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
                <GraduationCap className="h-5 w-5 text-gold-400" />
              </div>

              <span className="font-serif text-lg font-semibold text-navy-900">
                Digital Transcript System
              </span>

            </Link>

          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <h1 className="font-serif text-2xl font-bold text-navy-900">
            Sign in to your account
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Select your account type and enter your credentials.
          </p>

          {/* =================================================
              LOGIN TYPE
          ================================================= */}

          <div className="mt-6">

            <p className="mb-3 text-sm font-semibold text-navy-900">
              Login as
            </p>

            <div className="grid grid-cols-2 gap-3">

              {/* STUDENT */}

              <button
                type="button"
                onClick={() =>
                  handleRoleChange('STUDENT')
                }
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

              {/* ADMIN */}

              <button
                type="button"
                onClick={() =>
                  handleRoleChange('ADMIN')
                }
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

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">

              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />

              <span>{error}</span>

            </div>
          )}

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            {/* EMAIL */}

            <div>

              <label
                className="label"
                htmlFor="email"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder={
                    role === 'ADMIN'
                      ? 'admin@college.edu'
                      : 'student@college.edu'
                  }
                  className="input pl-10"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                className="label"
                htmlFor="password"
              >
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="input pl-10"
                />

              </div>

            </div>

            {/* SIGN IN */}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >

              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${
                  role === 'ADMIN'
                    ? 'Administrator'
                    : 'Student'
                }`
              )}

            </button>

          </form>

          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <p className="text-center text-sm text-slate-600">

              Don't have a{' '}
              {role === 'ADMIN'
                ? 'administrator'
                : 'student'}{' '}
              account?

            </p>

            <Link
              to={`/register?role=${role.toLowerCase()}`}
              className="mt-2 block text-center font-semibold text-navy-700 hover:text-navy-900"
            >
              Register as{' '}
              {role === 'ADMIN'
                ? 'Administrator'
                : 'Student'}
            </Link>

          </div>

          {/* =================================================
              SWITCH ACCOUNT TYPE
          ================================================= */}

          <p className="mt-5 text-center text-xs text-slate-400">
            You can switch between Student and Administrator
            login above.
          </p>

        </div>

      </div>

    </div>
  );
}