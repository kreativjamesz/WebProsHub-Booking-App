// Cookie utility functions for secure authentication

export interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const DEFAULT_OPTIONS: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  let cookieString = `${name}=${value}`;
  
  if (opts.path) cookieString += `; path=${opts.path}`;
  if (opts.domain) cookieString += `; domain=${opts.domain}`;
  if (opts.maxAge) cookieString += `; max-age=${opts.maxAge}`;
  if (opts.secure) cookieString += '; secure';
  if (opts.sameSite) cookieString += `; samesite=${opts.sameSite}`;
  
  // Note: httpOnly can only be set server-side
  // This is client-side cookie setting
  document.cookie = cookieString;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
  
  if (!cookie) return null;
  
  return cookie.split('=')[1];
}

export function removeCookie(name: string, options: CookieOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Set expiration to past date to remove cookie
  setCookie(name, '', { ...opts, maxAge: -1 });
}

export function clearAllAuthCookies() {
  removeCookie('authToken');
  removeCookie('adminToken');
  removeCookie('refreshToken');
}
