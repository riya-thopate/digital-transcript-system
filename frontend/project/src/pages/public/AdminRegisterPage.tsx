import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { apiFetch, setToken } from '@/services/api';
import type { User as AppUser } from '@/types';

interface AdminRegisterResponse {
  token: string;
  user: AppUser;
  expiresIn: number;
}

export function AdminRegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError('');

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response =
        await apiFetch<AdminRegisterResponse>(
          '/auth/admin/register',
          {
            method: 'POST',
            body: {
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              password: form.password,
            },
          },
        );

      setToken(response.token);

      navigate('/admin/dashboard', {
        replace: true,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Admin registration failed.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-8">

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-navy-100">
              <ShieldCheck className="h-7 w-7 text-navy-700" />
            </div>

            <h1 className="mt-4 font-serif text-2xl font-bold text-navy-900">
              Admin Registration
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create an administrator account for the Digital Transcript System.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-sm font-medium text-navy-900"
              >
                First Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-sm font-medium text-navy-900"
              >
                Last Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-navy-900"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-navy-900"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-navy-900"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="input pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? 'Creating Admin Account...'
                : 'Create Admin Account'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-navy-700 hover:text-navy-900"
              >
                Sign in
              </Link>
            </p>

            <p className="text-slate-500">
              Student registration?{' '}
              <Link
                to="/register"
                className="font-medium text-navy-700 hover:text-navy-900"
              >
                Register here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}