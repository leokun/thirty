export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateFr(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date));
}
