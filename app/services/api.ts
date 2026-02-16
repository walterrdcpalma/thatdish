import { env } from '@/config/env';

const baseUrl = env.apiUrl || '';

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}
