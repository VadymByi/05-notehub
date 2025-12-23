import { useState, useEffect } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import MonkeyLoader from "../MonkeyLoader/MonkeyLoader";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { useDebounce } from "use-debounce";
import { Toaster, toast } from "react-hot-toast";

const PER_PAGE = 10;
const MONKEY_DURATION = 3000;

export default function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMonkey, setShowMonkey] = useState(false);

  const [searchInput, setSearchInput] = useState(() => {
    return localStorage.getItem("notes-search") ?? "";
  });

  const [debouncedSearch] = useDebounce(searchInput, 500);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (isFetching) {
      setShowMonkey(true);
    } else {
      setShowMonkey(false);
    }
  }, [isFetching]);

  useEffect(() => {
    if (debouncedSearch && data && data.notes.length === 0) {
      toast("No notes found", { icon: "🔍" });
    }
  }, [data, debouncedSearch]);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />

      <header className={css.toolbar}>
        <SearchBox
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value);
            setPage(1);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isError && <p>Error loading notes</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}

      <MonkeyLoader show={showMonkey} duration={MONKEY_DURATION} />
    </div>
  );
}
