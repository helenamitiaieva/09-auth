'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/authStore';
import { checkSession } from '../lib/api/clientApi';


const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_PREFIXES = ['/sign-in', '/sign-up'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore(s => s.setUser);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await checkSession();
        setUser(user ?? null);
        if (!user && PRIVATE_PREFIXES.some(p => pathname.startsWith(p))) {
          router.replace('/sign-in');
        }
        if (user && AUTH_PREFIXES.some(p => pathname.startsWith(p))) {
          router.replace('/profile');
        }
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, [pathname, router, setUser]);

  if (checking) return <p style={{ padding: 16 }}>Checking session...</p>;

  return <>{children}</>;
}