import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import toast from "react-hot-toast";

interface NoteListProps {
  notes: Note[];
}
export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  if (notes.length === 0) return null;
  return (
    <ul className={css.list}>
      {notes.map((note) => {
        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>Note tag: {note.tag}</span>
              <button
                className={css.button}
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
