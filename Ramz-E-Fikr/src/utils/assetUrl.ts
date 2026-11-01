/**
 * Resolves a root-relative asset path (e.g. "/assets/images/x.jpg") against the
 * site's deploy base path (vite `base`), so files load correctly when the site is
 * hosted in a sub-folder such as https://<user>.github.io/Ramz-E-Fikr/.
 *
 * External URLs (http/https, protocol-relative, data:, blob:) and already-prefixed
 * paths are returned unchanged, so it is safe to call more than once.
 */
export function assetUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const base = import.meta.env.BASE_URL || '/';
  if (base !== '/' && path.startsWith(base)) return path;
  return base.replace(/\/$/, '') + path;
}
