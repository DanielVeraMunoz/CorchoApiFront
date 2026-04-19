export function timeAgo(dateString) {
  const diffDays = Math.floor((Date.now() - new Date(dateString)) / 86400000);
  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'ayer';
  if (diffDays < 7) return `hace ${diffDays}d`;
  return `hace ${Math.floor(diffDays / 7)}sem`;
}

export function formatMemberSince(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}
