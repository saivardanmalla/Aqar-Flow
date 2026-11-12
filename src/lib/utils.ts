export function formatPKR(amount: number): string {
  if (isNaN(amount)) return 'PKR 0';
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function formatCompactPKR(amount: number): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `PKR ${crore % 1 === 0 ? crore : crore.toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `PKR ${lakh % 1 === 0 ? lakh : lakh.toFixed(1)} Lakh`;
  }
  return formatPKR(amount);
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}
