import { useEffect, useState } from 'react';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '@/services/notificationApi';
import type { Notification } from '@/types';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bell } from 'lucide-react';

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
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

  if (loading) return <LoadingState message="Loading notifications..." />;
  if (error) return <ErrorState message="Failed to load notifications." onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">System notifications and request activity alerts.</p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <NotificationPanel
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      )}
    </div>
  );
}
