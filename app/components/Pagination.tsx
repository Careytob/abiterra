// components/Pagination.tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, baseUrl }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-4 mt-8">
      {currentPage > 1 && (
        <Link href={`${baseUrl}?page=${currentPage - 1}`} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Previous
        </Link>
      )}
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link href={`${baseUrl}?page=${currentPage + 1}`} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Next
        </Link>
      )}
    </div>
  );
};

export default Pagination;