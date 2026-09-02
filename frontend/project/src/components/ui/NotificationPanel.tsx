import type { Notification } from '@/types';
import { formatRelative } from '@/utils/helpers';
import { Bell, CheckCircle2, FileText, Info, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

const typeIcons: Record<string, LucideIcon> = {
  REQUEST_UPDATE: FileText,
  DOCUMENT_READY: CheckCircle2,
  SYSTEM: Info,
  VERIFICATION: ShieldCheck,
};

export function NotificationPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div className="card">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="flex items-center gap-2 font-semibold text-navy-900">
          <Bell className="h-5 w-5 text-navy-600" />
          Notifications
          {unread > 0 && (
            <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-medium text-navy-900">
              {unread} new
            </span>
          )}
        </h3>
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-navy-600 hover:text-navy-800"
          >
            Mark all as read
          </button>
        )}
      </div>
      <ul className="max-h-[32rem] divide-y divide-slate-100 overflow-y-auto">
        {notifications.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-slate-500">
            No notifications yet.
          </li>
        )}
        {notifications.map((n) => {
          const Icon = typeIcons[n.type] ?? Info;
          return (
            <li
              key={n.id}
              className={`flex items-start gap-3 px-5 py-3.5 transition-colors ${
                !n.read ? 'bg-navy-50/40' : ''
              }`}
            >
              <div
                className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                  !n.read ? 'bg-navy-100 text-navy-700' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-navy-900">{n.title}</p>
                  <span className="text-xs text-slate-400">{formatRelative(n.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{n.message}</p>
                <div className="mt-1.5 flex items-center gap-3">
                  {n.link && (
                    <Link
                      to={n.link}
                      className="text-xs font-medium text-navy-600 hover:text-navy-800"
                    >
                      View
                    </Link>
                  )}
                  {!n.read && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="text-xs font-medium text-slate-500 hover:text-navy-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              {!n.read && <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gold-500" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
