'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';

import css from './EditProfilePage.module.css';
import { getMe, updateMe } from '@/lib/api/clientApi';

export default function EditProfilePage() {
  const router = useRouter();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    refetchOnWindowFocus: false,
  });

  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { username: string }) => updateMe(payload),
    onSuccess: () => router.push('/profile'),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ username });
  };

  const onCancel = () => router.back();

  if (isLoading) {
    return (
      <main className={css.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className={css.mainContent}>
        <p>Could not load profile.</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isPending}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}