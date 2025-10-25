'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import css from './SignUpPage.module.css';
import { register } from '@/lib/api/clientApi';


export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    setError('');
    try {
      await register({ email, password });
      router.replace('/profile');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={onSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={css.input} required />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className={css.input} required />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>Register</button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}