import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import type { BadgeTone } from '../data/demo.js';

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
}) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
export function Button({
  className = '',
  variant = 'secondary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  return <button className={`button button-${variant} ${className}`} {...props} />;
}
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}
export function SectionHeader({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {meta && <span>{meta}</span>}
      </div>
      {action}
    </div>
  );
}
export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">✓</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function FilterBar({
  placeholder = 'Cerca…',
  children,
}: {
  placeholder?: string;
  children?: ReactNode;
}) {
  return (
    <div className="filter-bar">
      <label className="search-field">
        <Search size={16} aria-hidden="true" />
        <input type="search" placeholder={placeholder} aria-label={placeholder} />
      </label>
      {children}
      <Button>
        <SlidersHorizontal size={15} /> Filtri
      </Button>
    </div>
  );
}
export function Metric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
}) {
  return (
    <article className="metric-card">
      <div className={`metric-accent ${tone ?? ''}`} />
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}
export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <label className="form-field">
      <span className="field-label">
        {label}
        {required && <b aria-label="obbligatorio"> *</b>}
      </span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && (
        <small className="field-error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
}
export function Breadcrumbs({ items }: { items: readonly string[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Percorso">
      {items.map((item, index) => (
        <span key={item}>
          {item}
          {index < items.length - 1 && <ChevronRight size={13} />}
        </span>
      ))}
    </nav>
  );
}
export function DataTable({
  headers,
  children,
}: {
  headers: readonly string[];
  children: ReactNode;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
