const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function storageUrl(objectPath: string | null | undefined): string | null {
  if (!objectPath) return null;
  if (objectPath.startsWith("http")) return objectPath;
  const cleanPath = objectPath.startsWith("/") ? objectPath : `/${objectPath}`;
  return `${base}/api/storage${cleanPath}`;
}
