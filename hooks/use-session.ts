'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SessionUser {
  id: string;
  name: string;
  email?: string;
  image?: string;
}

interface Session {
  user: SessionUser | null;
  isLoading: boolean;
  error?: string;
}

// In-memory cache for session data
let sessionCache: { user: SessionUser | null; timestamp: number } | null = null;
const SESSION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for efficient session management
 * Uses client-side caching to avoid repeated server calls
 */
export function useSession(): Session {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();

  // Check if cache is still valid
  const isCacheValid = useCallback((): boolean => {
    if (!sessionCache) return false;
    const now = Date.now();
    return now - sessionCache.timestamp < SESSION_CACHE_TTL;
  }, []);

  // Fetch session from server (only when needed)
  const fetchSession = useCallback(async () => {
    try {
      // Use cache if valid
      if (isCacheValid() && sessionCache) {
        setSession(sessionCache.user);
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from server
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        cache: 'no-store',
      });

      if (!response.ok) {
        setSession(null);
        sessionCache = { user: null, timestamp: Date.now() };
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const user = data.user || null;

      // Update cache
      sessionCache = { user, timestamp: Date.now() };
      setSession(user);
      setError(undefined);
    } catch (err) {
      console.error('Failed to fetch session:', err);
      setError('Session fetch failed');
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [isCacheValid]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Invalidate cache on focus (mobile/tab switch)
  useEffect(() => {
    const handleFocus = () => {
      sessionCache = null; // Force refresh
      fetchSession();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchSession]);

  return {
    user: session,
    isLoading,
    error,
  };
}

/**
 * Manually invalidate session cache (e.g., after logout)
 */
export function invalidateSessionCache(): void {
  sessionCache = null;
}

/**
 * Get cached session synchronously (returns null if not loaded)
 */
export function getCachedSession(): SessionUser | null {
  if (sessionCache && isCacheValid()) {
    return sessionCache.user;
  }
  return null;
}

// Helper for checking cache validity
function isCacheValid(): boolean {
  if (!sessionCache) return false;
  const now = Date.now();
  return now - sessionCache.timestamp < SESSION_CACHE_TTL;
}
