export function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

export const Expense_CATEGORIES = [
  'Groceries',
  'Dining',
  'Transport',
  'Utilities',
  'Shopping',
  'Health',
  'Entertainment',
  'Travel',
  'Other',
];
