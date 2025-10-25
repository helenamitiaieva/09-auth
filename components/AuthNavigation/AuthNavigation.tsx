'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import css from './AuthNavigation.module.css';
import { logout } from '../lib/api/clientApi';
import { useAuthStore } from '../lib/store/authStore';

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.replace('/sign-in');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>Login</Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>Sign up</Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>Profile</Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button className={css.logoutButton} onClick={onLogout}>Logout</button>
      </li>
    </>
  );
}