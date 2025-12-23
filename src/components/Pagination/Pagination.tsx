import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
