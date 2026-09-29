/**
 * Utility to generate bulletproof shareable links.
 * Works seamlessly across:
 * - AI Studio Dev / Preview domain
 * - GitHub Pages (e.g. username.github.io/repo-name/)
 * - Vercel / Netlify / Custom Domain
 * - Localhost
 */

export function getShareUrl(senderName?: string): string {
  if (typeof window === 'undefined') return '';

  const url = new URL(window.location.href);

  // If a custom sender name is provided, update or set the 'from' query parameter
  if (senderName && senderName.trim()) {
    url.searchParams.set('from', senderName.trim());
  }

  // Clear any temporary hash fragments
  url.hash = '';

  return url.toString();
}
