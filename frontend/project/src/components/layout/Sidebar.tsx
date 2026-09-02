import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderOpen,
  Bell,
  User,
  Users,
  ScrollText,
  LogOut,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'New Request', to: '/student/request', icon: PlusCircle },
  { label: 'My Requests', to: '/student/requests', icon: FileText },
  { label: 'Documents', to: '/student/documents', icon: FolderOpen },
  { label: 'Notifications', to: '/student/notifications', icon: Bell },
  { label: 'Profile', to: '/student/profile', icon: User },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Requests', to: '/admin/requests', icon: FileText },
  { label: 'Students', to: '/admin/students', icon: Users },
  { label: 'Documents', to: '/admin/documents', icon: FolderOpen },
  { label: 'Notifications', to: '/admin/notifications', icon: Bell },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: ScrollText },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = user?.role === 'ADMIN' ? adminNav : studentNav;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 border-b border-navy-800/50 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
          <GraduationCap className="h-5 w-5 text-gold-400" />
        </div>
        <div>
          <p className="font-serif text-sm font-semibold leading-tight text-white">
            Digital Transcript
          </p>
          <p className="text-xs text-navy-300">NIT Administration</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-navy-400">
          {user?.role === 'ADMIN' ? 'Administration' : 'Student Portal'}
        </p>
        {nav.map((item) => {
          const active =
            location.pathname === item.to ||
            (item.to !== '/student/dashboard' &&
              item.to !== '/admin/dashboard' &&
              location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-navy-800 text-white'
                  : 'text-navy-200 hover:bg-navy-800/60 hover:text-white'
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-navy-800/50 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-navy-900">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-navy-300">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-800/60 hover:text-white"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 bg-navy-900 lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-navy-900">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 text-navy-300"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Mobile menu trigger - rendered by AppLayout */}
      <MobileMenuButton onClick={() => setMobileOpen(true)} />
    </>
  );
}

function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white shadow-md lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

export function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-xs font-semibold text-navy-900">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function VerificationBadge() {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-success-600">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Verified
    </div>
  );
}
