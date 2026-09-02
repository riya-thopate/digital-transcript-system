import { Filter } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onReset,
}: {
  filters: { key: string; label: string; options: FilterOption[] }[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset?: () => void;
}) {
  const hasActive = Object.values(values).some((v) => v);
  return (
    <div className="flex flex-wrap items-end gap-3">
      {filters.map((f) => (
        <div key={f.key} className="min-w-[160px]">
          <label className="label">{f.label}</label>
          <select
            value={values[f.key] ?? ''}
            onChange={(e) => onChange(f.key, e.target.value)}
            className="input"
          >
            <option value="">All</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {hasActive && onReset && (
        <button onClick={onReset} className="btn btn-ghost flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}
