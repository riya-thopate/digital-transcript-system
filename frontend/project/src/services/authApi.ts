import { apiFetch, setToken, clearToken, USE_MOCKS } from './api';
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

export async function login(req: LoginRequest): Promise<AuthenticationResponse> {
  if (USE_MOCKS) {
    await delay(600);
    const user = mockUsers.find((u) => u.email === req.email);
    if (!user || req.password !== mockPassword) {
      throw new Error('Invalid email or password. Use the demo credentials shown below.');
    }
    setToken(mockToken);
    return { token: mockToken, user, expiresIn: 3600 };
  }
  const res = await apiFetch<AuthenticationResponse>('/auth/login', {
    method: 'POST',
    body: req,
  });
  setToken(res.token);
  return res;
}

export async function register(req: RegisterRequest): Promise<AuthenticationResponse> {
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
    return { token: mockToken, user: newUser, expiresIn: 3600 };
  }
  const res = await apiFetch<AuthenticationResponse>('/auth/register', {
    method: 'POST',
    body: req,
  });
  setToken(res.token);
  return res;
}

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

export async function logout(): Promise<void> {
  if (USE_MOCKS) {
    clearToken();
    return;
  }
  try {
    await apiFetch<void>('/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export async function demoLogin(role: UserRole): Promise<AuthenticationResponse> {
  if (USE_MOCKS) {
    await delay(400);
    const user = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    setToken(mockToken);
    return { token: mockToken, user, expiresIn: 3600 };
  }
  const creds =
    role === 'ADMIN'
      ? { email: 'admin@college.edu', password: 'password123' }
      : { email: 'student@college.edu', password: 'password123' };
  return login(creds);
}

export function getDemoStudent() {
  return mockStudents[0];
}
