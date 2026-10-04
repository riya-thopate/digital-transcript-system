import {
  apiFetch,
  setToken,
  clearToken,
  USE_MOCKS,
} from './api';

import type {
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from '@/types';

import {
  mockToken,
  mockUsers,
  mockPassword,
  mockStudents,
} from '@/mocks/data';

import { delay } from '@/utils/helpers';

// ============================================================
// ADMIN REGISTRATION
// ============================================================

export async function registerAdmin(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthenticationResponse> {

  if (USE_MOCKS) {
    await delay(800);

    const newUser: User = {
      id: `admin-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'ADMIN',
    };

    setToken(mockToken);

    return {
      token: mockToken,
      user: newUser,
      expiresIn: 3600,
    };
  }

  const res = await apiFetch<AuthenticationResponse>(
    '/auth/admin/register',
    {
      method: 'POST',
      body: data,
    },
  );

  setToken(res.token);

  return res;
}

// ============================================================
// LOGIN
// ============================================================

export async function login(
  req: LoginRequest,
): Promise<AuthenticationResponse> {

  if (USE_MOCKS) {
    await delay(600);

    const user = mockUsers.find(
      (u) => u.email === req.email,
    );

    if (!user || req.password !== mockPassword) {
      throw new Error(
        'Invalid email or password.',
      );
    }

    setToken(mockToken);

    return {
      token: mockToken,
      user,
      expiresIn: 3600,
    };
  }

  const res = await apiFetch<AuthenticationResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: req,
    },
  );

  setToken(res.token);

  return res;
}

// ============================================================
// STUDENT REGISTRATION
// ============================================================

export async function register(
  req: RegisterRequest,
): Promise<AuthenticationResponse> {

  if (USE_MOCKS) {
    await delay(800);

    const newUser: User = {
      id: `u-${Date.now()}`,
      email: req.email,
      firstName: req.firstName,
      lastName: req.lastName,
      role: 'STUDENT',
    };

    setToken(mockToken);

    return {
      token: mockToken,
      user: newUser,
      expiresIn: 3600,
    };
  }

  /*
   * IMPORTANT:
   * This endpoint is ONLY for student registration.
   */
  const res = await apiFetch<AuthenticationResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: {
        ...req,
        role: 'STUDENT',
      },
    },
  );

  setToken(res.token);

  return res;
}

// ============================================================
// GET CURRENT USER
// ============================================================

export async function getCurrentUser(): Promise<User | null> {

  if (USE_MOCKS) {
    await delay(200);
    return mockUsers[0] ?? null;
  }

  try {
    return await apiFetch<User>('/auth/me');
  } catch {
    return null;
  }
}

// ============================================================
// LOGOUT
// ============================================================

export async function logout(): Promise<void> {

  if (USE_MOCKS) {
    clearToken();
    return;
  }

  try {
    await apiFetch<void>(
      '/auth/logout',
      {
        method: 'POST',
      },
    );
  } finally {
    /*
     * Logout only removes the local login token.
     *
     * It does NOT delete:
     * - users
     * - requests
     * - notifications
     * - documents
     * - database history
     */
    clearToken();
  }
}

// ============================================================
// DEMO LOGIN
// ============================================================

export async function demoLogin(
  role: UserRole,
): Promise<AuthenticationResponse> {

  if (USE_MOCKS) {
    await delay(400);

    const user =
      mockUsers.find(
        (u) => u.role === role,
      ) ?? mockUsers[0];

    setToken(mockToken);

    return {
      token: mockToken,
      user,
      expiresIn: 3600,
    };
  }

  const creds =
    role === 'ADMIN'
      ? {
          email: 'admin@college.edu',
          password: 'password123',
        }
      : {
          email: 'student@college.edu',
          password: 'password123',
        };

  return login(creds);
}

// ============================================================
// LEGACY DEMO STUDENT
// ============================================================

export function getDemoStudent() {
  return mockStudents[0];
}