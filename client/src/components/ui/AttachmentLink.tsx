import React, { useState } from 'react';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';
import { fileDownloadError } from '@/utils/fileDownloadError';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { module: 'travel' | 'expenses' | 'policies'; href: string };
export function AttachmentLink({ module, href, children, onClick, ...props }: Props) {
  const [busy, setBusy] = useState(false);
  const apiOrigin = new URL(apiClient.defaults.baseURL || '/api', window.location.origin).origin;
  let file: string | undefined;
  try {
    const parsed = new URL(href, apiOrigin);
    if (parsed.origin === apiOrigin && parsed.pathname.startsWith('/api/uploads/')) {
      file = decodeURIComponent(parsed.pathname.slice('/api/uploads/'.length));
    }
  } catch { /* Invalid links remain unavailable. */ }
  if (!file) {
    if (!/^https?:\/\//i.test(href)) return <span {...{ className: props.className }}>{children} (unavailable)</span>;
    return <a {...props} href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>{children}</a>;
  }
  return <a {...props} href={href} aria-busy={busy} onClick={async event => {
    event.preventDefault(); event.stopPropagation(); onClick?.(event);
    if (busy) return;
    setBusy(true);
    try {
      const response = await apiClient.get(`/upload/files/${module}/${encodeURIComponent(file!)}`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a'); link.href = url; link.download = file!;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { toast.error(fileDownloadError(error as { response?: { status?: number } }, 'Unable to download this attachment. Please try again.')); }
    finally { setBusy(false); }
  }}>{busy ? 'Downloading…' : children}</a>;
}
