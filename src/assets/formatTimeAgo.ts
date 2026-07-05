export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);

  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "agora";
  }

  const minutes = Math.floor(diffInSeconds / 60);

  if (minutes < 60) {
    return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `há ${days} dia${days > 1 ? "s" : ""}`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 4) {
    return `há ${weeks} semana${weeks > 1 ? "s" : ""}`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `há ${months} mês${months > 1 ? "es" : ""}`;
  }

  const years = Math.floor(days / 365);

  return `há ${years} ano${years > 1 ? "s" : ""}`;
}
