export function allocateBudget(total: number, costs: number[]): { spent: number; remaining: number; overBudget: boolean } {
  if (!Number.isFinite(total) || total < 0 || costs.some(value => !Number.isFinite(value) || value < 0)) throw new Error("Invalid monetary value");
  const spent = Math.round(costs.reduce((sum, value) => sum + value, 0) * 100) / 100;
  return { spent, remaining: Math.round((total - spent) * 100) / 100, overBudget: spent > total };
}

export function calculateUpgradeTotal(items: Array<{ unitAmount: number; quantity: number; taxRate?: number }>): { subtotal: number; tax: number; total: number } {
  const cents = (value: number) => Math.round(value * 100);
  const subtotalCents = items.reduce((sum, item) => sum + cents(item.unitAmount) * item.quantity, 0);
  const taxCents = items.reduce((sum, item) => sum + Math.round(cents(item.unitAmount) * item.quantity * (item.taxRate ?? 0)), 0);
  return { subtotal: subtotalCents / 100, tax: taxCents / 100, total: (subtotalCents + taxCents) / 100 };
}
