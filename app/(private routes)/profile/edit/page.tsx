"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import css from "./EditProfilePage.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type UpdatePayload = { username: string };
type User = {
  id: string;
  email: string;
  username: string;
  avatar: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    refetchOnWindowFocus: false,
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

  const {
    mutateAsync,
    isPending,
  }: UseMutationResult<User, unknown, UpdatePayload> = useMutation({
    mutationFn: (payload: UpdatePayload) => updateMe(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["me"], updatedUser);
      setUser(updatedUser);
      router.push("/profile");
    },
  }) as unknown as UseMutationResult<User, unknown, UpdatePayload>;

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
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending}
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
