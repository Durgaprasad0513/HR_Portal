/** Resolve uploaded images against the API host, including split-host production deployments. */
export function profilePhotoUrl(value: string, apiBase = import.meta.env.VITE_API_URL || '/api', frontendOrigin = window.location.origin): string {
  try {
    const photo = new URL(value, frontendOrigin);
    if (photo.origin !== frontendOrigin || !photo.pathname.startsWith('/api/uploads/')) return value;
    const base = new URL(apiBase.replace(/\/$/, '') + '/', frontendOrigin);
    return new URL(photo.pathname.slice('/api/'.length) + photo.search, base).href;
  } catch { return value; }
}
