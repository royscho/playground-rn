import { client } from '@/shared/api/client';
import type { Note } from '../types/notes.types';

type JsonPlaceholderPost = { id: number; title: string };

export const fetchNotes = async (): Promise<Note[]> => {
  const posts = await client.get<JsonPlaceholderPost[]>('/posts?_limit=10');
  return posts.map((post) => ({ id: String(post.id), title: post.title }));
};

export const createNote = async (title: string): Promise<Note> => {
  const post = await client.post<JsonPlaceholderPost>('/posts', { title });
  return { id: String(post.id), title: post.title };
};

export const deleteNote = async (id: string): Promise<void> => {
  await client.delete(`/posts/${id}`);
};
