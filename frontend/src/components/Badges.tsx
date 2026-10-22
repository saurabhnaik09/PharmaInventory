import React from 'react';
import type { StockStatus, OrderStatus, AlertType } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Circle,
  Loader2,
  Truck,
  Ban,
} from 'lucide-react';

// ─── Stock Status Badge ───────────────────────────────────────────────────────

interface StockBadgeProps {
  status: StockStatus;
  size?: 'sm' | 'md';
}

const stockConfig: Record<StockStatus, { label: string; className: string; icon: React.ReactNode }> = {
  in_stock:      { label: 'In Stock',       className: 'badge badge-in-stock',      icon: <CheckCircle2 size={12} /> },
  low_stock:     { label: 'Low Stock',      className: 'badge badge-low-stock',     icon: <AlertTriangle size={12} /> },
  out_of_stock:  { label: 'Out of Stock',   className: 'badge badge-out-of-stock',  icon: <XCircle size={12} /> },
  expiring_soon: { label: 'Expiring Soon',  className: 'badge badge-expiring-soon', icon: <Clock size={12} /> },
};

export function StockStatusBadge({ status }: StockBadgeProps) {
  const config = stockConfig[status];
  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
}

// ─── Order Status Badge ───────────────────────────────────────────────────────

interface OrderBadgeProps {
  status: OrderStatus;
}

const orderConfig: Record<OrderStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pending:    { label: 'Pending',    className: 'badge badge-pending',    icon: <Circle size={10} /> },
  accepted:   { label: 'Accepted',   className: 'badge badge-accepted',   icon: <CheckCircle2 size={10} /> },
  processing: { label: 'Processing', className: 'badge badge-processing', icon: <Loader2 size={10} /> },
  dispatched: { label: 'Dispatched', className: 'badge badge-dispatched', icon: <Truck size={10} /> },
  completed:  { label: 'Completed',  className: 'badge badge-completed',  icon: <CheckCircle2 size={10} /> },
  rejected:   { label: 'Rejected',   className: 'badge badge-rejected',   icon: <Ban size={10} /> },
};

export function OrderStatusBadge({ status }: OrderBadgeProps) {
  const config = orderConfig[status];
  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
}

// ─── Alert Type Badge ─────────────────────────────────────────────────────────

interface AlertBadgeProps {
  type: AlertType;
}

const alertConfig: Record<AlertType, { label: string; className: string; icon: React.ReactNode }> = {
  low_stock:     { label: 'Low Stock',      className: 'badge badge-low-stock',     icon: <AlertTriangle size={12} /> },
  out_of_stock:  { label: 'Out of Stock',   className: 'badge badge-out-of-stock',  icon: <XCircle size={12} /> },
  expiring_soon: { label: 'Expiring Soon',  className: 'badge badge-expiring-soon', icon: <Clock size={12} /> },
};

export function AlertTypeBadge({ type }: AlertBadgeProps) {
  const config = alertConfig[type];
  return (
    <span className={config.className}>
      {config.icon}
      {config.label}
    </span>
  );
}

// ─── Source Type Badge ────────────────────────────────────────────────────────

export function SourceTypeBadge({ type }: { type: 'pharmacy' | 'supplier' }) {
  if (type === 'pharmacy') {
    return (
      <span className="badge" style={{ background: '#F0FDF4', color: '#15803D' }}>
        <CheckCircle2 size={10} /> Pharmacy
      </span>
    );
  }
  return (
    <span className="badge" style={{ background: '#FFF7ED', color: '#9A3412' }}>
      <Truck size={10} /> Supplier
    </span>
  );
}
