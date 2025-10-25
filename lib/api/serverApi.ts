import 'server-only';
import axios from 'axios';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { cookies } from 'next/headers';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function withCookie() {
  const cookie = cookies().toString();
  return axios.create({ baseURL, headers: { Cookie: cookie }, withCredentials: true });
}

export async function fetchNotes(params: { search?: string; page?: number; perPage?: number; tag?: string }) {
  const client = withCookie();
  const { data } = await client.get<{ notes: Note[]; totalPages: number }>('/notes', { params });
  return data;
}
export async function fetchNoteById(id: string) {
  const client = withCookie();
  const { data } = await client.get<Note>(`/notes/${id}`);
  return data;
}

export async function getMe() {
  const client = withCookie();
  const { data } = await client.get<User>('/users/me');
  return data;
}
export async function checkSession() {
  const client = withCookie();
  const { data } = await client.get<User | undefined>('/auth/session');
  return data;
}