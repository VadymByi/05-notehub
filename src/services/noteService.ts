import { api } from "./api";
import type { Note, NoteTag } from "../types/note";

interface FetchNotesParams {
  search?: string;
  tag?: NoteTag;
  page?: number;
  perPage?: number;
  sortBy?: "created" | "updated";
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type CreateNotePayload = Omit<Note, "id" | "createdAt" | "updatedAt">;

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      search: params.search,
      tag: params.tag,
      page: params.page,
      perPage: params.perPage,
      sortBy: params.sortBy,
    },
  });
  return response.data;
}
export async function createNote(note: CreateNotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", note);
  return response.data;
}
export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
}
