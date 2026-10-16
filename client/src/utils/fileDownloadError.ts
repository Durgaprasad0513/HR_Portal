export function fileDownloadError(error: { response?: { status?: number } }, fallback: string): string {
  switch (error.response?.status) {
    case 404: return 'This file is no longer available in storage. Ask HR to restore it or upload it again.';
    case 503: return 'File storage is unavailable. Please try again later or contact your administrator.';
    case 403: return 'You do not have permission to download this file.';
    default: return fallback;
  }
}
