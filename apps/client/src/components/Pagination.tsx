import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (currentPage: number) => void;
}

export default function PaginationWithNextAndPrevious({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <>
      <Button
        className="mr-2"
        color="primary"
        isDisabled={currentPage === 1}
        size="sm"
        variant="flat"
        onPress={() =>
          onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)
        }
      >
        Previous
      </Button>
      <Pagination
        color="primary"
        page={currentPage}
        total={totalPages}
        onChange={onPageChange}
      />
      <Button
        className="ml-2"
        color="primary"
        isDisabled={currentPage >= totalPages}
        size="sm"
        variant="flat"
        onPress={() =>
          onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)
        }
      >
        Next
      </Button>
    </>
  );
}
