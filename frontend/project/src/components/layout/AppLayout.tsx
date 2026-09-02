import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/student/dashboard': 'Dashboard',
  '/student/profile': 'My Profile',
  '/student/request': 'New Document Request',
  '/student/requests': 'My Requests',
  '/student/documents': 'My Documents',
  '/student/notifications': 'Notifications',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/requests': 'Request Management',
  '/admin/students': 'Student Management',
  '/admin/documents': 'Document Management',
  '/admin/notifications': 'Notifications',
  '/admin/audit-logs': 'Audit Logs',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.includes('/student/requests/')) return 'Request Details';
  if (pathname.includes('/admin/requests/')) return 'Request Details';
  return 'Dashboard';
}

export function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const notifLink =
    user?.role === 'ADMIN' ? '/admin/notifications' : '/student/notifications';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 pl-16 backdrop-blur-sm sm:px-6 lg:pl-6">
          <div>
            <h1 className="font-serif text-lg font-semibold text-navy-900">{title}</h1>
            <p className="text-xs text-slate-500">
              {user?.role === 'ADMIN' ? 'Administration Panel' : 'Student Portal'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={notifLink}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
