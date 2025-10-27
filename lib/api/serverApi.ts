import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

async function serverClient(): Promise<AxiosInstance> {
  const cookieStore = await cookies();        
  const cookieHeader = cookieStore
    .getAll()                                   
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  return axios.create({
    baseURL,
    withCredentials: true,
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
}

export async function fetchNotes(params: {
  search?: string; page?: number; perPage?: number; tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const res = await (await serverClient()).get<{ notes: Note[]; totalPages: number }>(
    '/notes',
    { params }
  );
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await (await serverClient()).get<Note>(`/notes/${id}`);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await (await serverClient()).get<User>('/users/me');
  return res.data;
}

export async function checkSession(): Promise<AxiosResponse<User | undefined>> {
  return (await serverClient()).get<User | undefined>('/auth/session');
}