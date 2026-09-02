import type { LucideIcon } from 'lucide-react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardCard({
  label,
  value,
  icon: Icon,
  color = 'navy',
  trend,
  to,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'navy' | 'gold' | 'success' | 'warning' | 'error' | 'blue';
  trend?: string;
  to?: string;
}) {
  const colors: Record<string, { bg: string; text: string; ring: string }> = {
    navy: { bg: 'bg-navy-100', text: 'text-navy-700', ring: 'ring-navy-200' },
    gold: { bg: 'bg-gold-100', text: 'text-gold-700', ring: 'ring-gold-200' },
    success: { bg: 'bg-success-100', text: 'text-success-700', ring: 'ring-success-100' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-200' },
    error: { bg: 'bg-error-100', text: 'text-error-700', ring: 'ring-error-100' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200' },
  };
  const c = colors[color];

  const content = (
    <div className="card p-5 transition-all hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${c.bg} ${c.ring}`}>
          <Icon className={`h-5.5 w-5.5 ${c.text}`} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <TrendingUp className="h-3.5 w-3.5" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-navy-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="group block">
        {content}
        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-navy-600 opacity-0 transition-opacity group-hover:opacity-100">
          View details <ArrowRight className="h-3 w-3" />
        </div>
      </Link>
    );
  }
  return content;
}
