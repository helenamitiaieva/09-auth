import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import { api } from './api';

export async function fetchNotes(params: { search?: string; page?: number; perPage?: number; tag?: string }) {
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>('/notes', { params });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: { title: string; content: string; tag: Note['tag'] }) {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

type AuthDto = { email: string; password: string };

export async function register(payload: AuthDto) {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
}
export async function login(payload: AuthDto) {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
}
export async function logout() {
  await api.post('/auth/logout');
}

export async function checkSession() {
  const { data } = await api.get<User | undefined>('/auth/session');
  return data;
}
export async function getMe() {
  const { data } = await api.get<User>('/users/me');
  return data;
}
export async function updateMe(payload: { username: string }) {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
}