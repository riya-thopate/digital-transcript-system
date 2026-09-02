import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getMyRequests } from '@/services/requestApi';
import { getMyNotifications } from '@/services/notificationApi';
import { getDemoStudent } from '@/services/authApi';
import type { DocumentRequest, Notification, Student } from '@/types';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { RequestCard } from '@/components/ui/RequestCard';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FileText, Clock, FileCheck2, FileX2, PlusCircle, Bell } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead } from '@/services/notificationApi';

export function StudentDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getMyRequests({ size: 5 }), getMyNotifications()])
      .then(([reqRes, notifs]) => {
        setRequests(reqRes.content);
        setNotifications(notifs);
        setStudent(getDemoStudent());
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (loading) return <LoadingState message="Loading your dashboard..." />;
  if (error) return <ErrorState message="Failed to load dashboard data." onRetry={() => window.location.reload()} />;

  const pending = requests.filter((r) => r.status === 'PENDING').length;
  const approved = requests.filter((r) => r.status === 'APPROVED' || r.status === 'AVAILABLE').length;
  const rejected = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-navy-800 to-navy-700 p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Welcome, {user?.firstName}
              </h2>
              <p className="mt-1 text-navy-200">
                {student?.studentId} — {student?.course}
              </p>
            </div>
            <Link to="/student/request" className="btn btn-gold">
              <PlusCircle className="h-4 w-4" />
              New Request
            </Link>
          </div>
        </div>
        {student && (
          <div className="grid gap-px bg-slate-200 sm:grid-cols-3">
            <InfoCell label="Department" value={student.department} />
            <InfoCell label="Year of Study" value={`Year ${student.yearOfStudy}`} />
            <InfoCell label="Status" value={student.status} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard label="Total Requests" value={requests.length} icon={FileText} color="navy" to="/student/requests" />
        <DashboardCard label="Pending" value={pending} icon={Clock} color="warning" to="/student/requests" />
        <DashboardCard label="Approved" value={approved} icon={FileCheck2} color="success" to="/student/requests" />
        <DashboardCard label="Rejected" value={rejected} icon={FileX2} color="error" to="/student/requests" />
      </div>

      {/* Recent + Notifications */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-navy-900">Recent Requests</h3>
            <Link to="/student/requests" className="text-sm font-medium text-navy-600 hover:text-navy-800">
              View all
            </Link>
          </div>
          {requests.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-slate-500">No requests yet. Create your first document request.</p>
              <Link to="/student/request" className="btn btn-primary mt-4">
                <PlusCircle className="h-4 w-4" />
                New Request
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 4).map((r) => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-navy-600" />
            <h3 className="font-serif text-lg font-semibold text-navy-900">Recent Notifications</h3>
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

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-navy-900">{value}</p>
    </div>
  );
}
