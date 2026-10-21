// Utility functions for business logic

import type { StockStatus, AlertType } from '../types';

// ─── Stock Status ─────────────────────────────────────────────────────────────

export function computeStockStatus(
  currentStock: number,
  minimumStock: number,
  expiryDate: string
): StockStatus {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysToExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (currentStock === 0) return 'out_of_stock';
  if (currentStock <= minimumStock) return 'low_stock';
  if (daysToExpiry <= 90) return 'expiring_soon';
  return 'in_stock';
}

export function daysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isExpiringSoon(expiryDate: string, withinDays = 90): boolean {
  return daysUntilExpiry(expiryDate) <= withinDays;
}

// ─── Alert Type ───────────────────────────────────────────────────────────────

export function stockStatusToAlertType(status: StockStatus): AlertType | null {
  if (status === 'out_of_stock') return 'out_of_stock';
  if (status === 'low_stock') return 'low_stock';
  if (status === 'expiring_soon') return 'expiring_soon';
  return null;
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
}

// ─── ID Generation ────────────────────────────────────────────────────────────

export function generateOrderId(type: 'pharmacy' | 'supplier'): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900) + 100).padStart(5, '0');
  return type === 'pharmacy' ? `REQ-${year}-${num}` : `ORD-${year}-${num}`;
}

// ─── Search / Filter ──────────────────────────────────────────────────────────

export function matchesMedicineSearch(query: string, ...fields: string[]): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return fields.some(f => f.toLowerCase().includes(q));
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}
