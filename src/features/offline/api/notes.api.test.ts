import { client } from '@/shared/api/client';
import { createNote, deleteNote, fetchNotes } from './notes.api';

jest.mock('@/shared/api/client', () => ({
  client: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

describe('notes.api', () => {
  afterEach(() => jest.clearAllMocks());

  it('fetchNotes maps posts to notes', async () => {
    (client.get as jest.Mock).mockResolvedValue([{ id: 1, title: 'a' }]);
    const notes = await fetchNotes();
    expect(client.get).toHaveBeenCalledWith('/posts?_limit=10');
    expect(notes).toEqual([{ id: '1', title: 'a' }]);
  });

  it('createNote posts title and maps result', async () => {
    (client.post as jest.Mock).mockResolvedValue({ id: 101, title: 'new' });
    const note = await createNote('new');
    expect(client.post).toHaveBeenCalledWith('/posts', { title: 'new' });
    expect(note).toEqual({ id: '101', title: 'new' });
  });

  it('deleteNote calls delete with id', async () => {
    (client.delete as jest.Mock).mockResolvedValue(undefined);
    await deleteNote('5');
    expect(client.delete).toHaveBeenCalledWith('/posts/5');
  });
});
