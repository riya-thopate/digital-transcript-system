import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { StudentRoute, AdminRoute } from '@/components/routing/ProtectedRoute';
import { ToastContainer } from '@/components/ui/Toast';

import { HomePage } from '@/pages/public/HomePage';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { VerifyPage } from '@/pages/public/VerifyPage';
import { AboutPage } from '@/pages/public/AboutPage';

import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentProfile } from '@/pages/student/StudentProfile';
import { StudentRequest } from '@/pages/student/StudentRequest';
import { StudentRequests } from '@/pages/student/StudentRequests';
import { StudentRequestDetails } from '@/pages/student/StudentRequestDetails';
import { StudentDocuments } from '@/pages/student/StudentDocuments';
import { StudentNotifications } from '@/pages/student/StudentNotifications';

import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminRequests } from '@/pages/admin/AdminRequests';
import { AdminRequestDetails } from '@/pages/admin/AdminRequestDetails';
import { AdminStudents } from '@/pages/admin/AdminStudents';
import { AdminDocuments } from '@/pages/admin/AdminDocuments';
import { AdminNotifications } from '@/pages/admin/AdminNotifications';
import { AdminAuditLogs } from '@/pages/admin/AdminAuditLogs';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/verify" element={<VerifyPage />} />
          </Route>

          {/* =========================
              AUTH ROUTES
          ========================= */}
          <Route path="/login" element={<LoginPage />} />

          {/* 
            Registration role is selected using:
            /register?role=student
            /register?role=admin
          */}
          <Route path="/register" element={<RegisterPage />} />

          {/* =========================
              STUDENT ROUTES
          ========================= */}
          <Route
            element={
              <StudentRoute>
                <AppLayout />
              </StudentRoute>
            }
          >
            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/profile"
              element={<StudentProfile />}
            />

            <Route
              path="/student/request"
              element={<StudentRequest />}
            />

            <Route
              path="/student/requests"
              element={<StudentRequests />}
            />

            <Route
              path="/student/requests/:id"
              element={<StudentRequestDetails />}
            />

            <Route
              path="/student/documents"
              element={<StudentDocuments />}
            />

            <Route
              path="/student/notifications"
              element={<StudentNotifications />}
            />
          </Route>

          {/* =========================
              ADMIN ROUTES
          ========================= */}
          <Route
            element={
              <AdminRoute>
                <AppLayout />
              </AdminRoute>
            }
          >
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/requests"
              element={<AdminRequests />}
            />

            <Route
              path="/admin/requests/:id"
              element={<AdminRequestDetails />}
            />

            <Route
              path="/admin/students"
              element={<AdminStudents />}
            />

            <Route
              path="/admin/documents"
              element={<AdminDocuments />}
            />

            <Route
              path="/admin/notifications"
              element={<AdminNotifications />}
            />

            <Route
              path="/admin/audit-logs"
              element={<AdminAuditLogs />}
            />
          </Route>

          {/* =========================
              FALLBACK
          ========================= */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}