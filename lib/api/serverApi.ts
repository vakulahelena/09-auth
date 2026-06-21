import { cookies } from "next/headers";
import { nextServer } from "./api";
import { CheckSessionRequest, FetchNotesResponse } from "./clientApi";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export async function fetchNotes(
  searchQuery: string = "",
  page: number = 1,
  notesTag?: string,
) {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search: searchQuery || undefined,
      tag: notesTag || undefined,
    },
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function getMe() {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function checkSession() {
  const cookieStore = await cookies();

  const res = await nextServer.get<CheckSessionRequest>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return res;
}
