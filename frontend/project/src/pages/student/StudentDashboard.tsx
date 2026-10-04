import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getMyRequests } from '@/services/requestApi';
import { getMyNotifications } from '@/services/notificationApi';
import type { DocumentRequest, Notification } from '@/types';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { RequestCard } from '@/components/ui/RequestCard';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  FileText,
  Clock,
  FileCheck2,
  FileX2,
  PlusCircle,
  Bell,
} from 'lucide-react';
import {
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/notificationApi';

export function StudentDashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    Promise.all([
      getMyRequests({ size: 5 }),
      getMyNotifications(),
    ])
      .then(([reqRes, notifs]) => {
        setRequests(reqRes.content);
        setNotifications(notifs);
      })
      .catch((err) => {
        console.error('Dashboard loading error:', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, read: true }
          : n
      )
    );
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load dashboard data."
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!user) {
    return (
      <ErrorState
        message="You are not logged in."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const pending = requests.filter(
    (r) => r.status === 'PENDING'
  ).length;

  const approved = requests.filter(
    (r) =>
      r.status === 'APPROVED' ||
      r.status === 'AVAILABLE'
  ).length;

  const rejected = requests.filter(
    (r) => r.status === 'REJECTED'
  ).length;

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="card overflow-hidden">

        <div className="bg-gradient-to-r from-navy-800 to-navy-700 p-6 sm:p-8">

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <h2 className="font-serif text-2xl font-bold text-white">
                Welcome, {user.firstName} {user.lastName}
              </h2>

              <p className="mt-1 text-navy-200">
                {user.studentId} — {user.course}
              </p>

            </div>

            <Link
              to="/student/request"
              className="btn btn-gold"
            >
              <PlusCircle className="h-4 w-4" />
              New Request
            </Link>

          </div>

        </div>

        {/* Student Information */}
        <div className="grid gap-px bg-slate-200 sm:grid-cols-4">

          <InfoCell
            label="Department"
            value={user.department}
          />

          <InfoCell
            label="Year of Study"
            value={`Year ${user.yearOfStudy}`}
          />

          <InfoCell
            label="Student ID"
            value={user.studentId}
          />

          <InfoCell
            label="Account Status"
            value="Active"
          />

        </div>

      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          label="Total Requests"
          value={requests.length}
          icon={FileText}
          color="navy"
          to="/student/requests"
        />

        <DashboardCard
          label="Pending"
          value={pending}
          icon={Clock}
          color="warning"
          to="/student/requests"
        />

        <DashboardCard
          label="Approved"
          value={approved}
          icon={FileCheck2}
          color="success"
          to="/student/requests"
        />

        <DashboardCard
          label="Rejected"
          value={rejected}
          icon={FileX2}
          color="error"
          to="/student/requests"
        />

      </div>

      {/* Recent Requests + Notifications */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Requests */}
        <div className="lg:col-span-2">

          <div className="mb-3 flex items-center justify-between">

            <h3 className="font-serif text-lg font-semibold text-navy-900">
              Recent Requests
            </h3>

            <Link
              to="/student/requests"
              className="text-sm font-medium text-navy-600 hover:text-navy-800"
            >
              View all
            </Link>

          </div>

          {requests.length === 0 ? (

            <div className="card p-8 text-center">

              <p className="text-sm text-slate-500">
                No requests yet. Create your first document request.
              </p>

              <Link
                to="/student/request"
                className="btn btn-primary mt-4"
              >
                <PlusCircle className="h-4 w-4" />
                New Request
              </Link>

            </div>

          ) : (

            <div className="space-y-3">

              {requests.slice(0, 4).map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                />
              ))}

            </div>

          )}

        </div>

        {/* Notifications */}
        <div>

          <div className="mb-3 flex items-center gap-2">

            <Bell className="h-5 w-5 text-navy-600" />

            <h3 className="font-serif text-lg font-semibold text-navy-900">
              Recent Notifications
            </h3>

          </div>

          <NotificationPanel
            notifications={notifications.slice(0, 4)}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />

        </div>

      </div>

    </div>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white px-5 py-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-medium text-navy-900">
        {value}
      </p>

    </div>
  );
}