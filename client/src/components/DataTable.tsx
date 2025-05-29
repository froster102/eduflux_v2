import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@heroui/input";
import debounce from "lodash.debounce";

interface Column {
  uid: string;
  name: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  keyProp: string;
  isLoading?: boolean;
  renderCell: (item: T, columnKey: string) => React.ReactNode;
  initialVisibleColumns?: string[];
  statusOptions?: { name: string; uid: string }[];
  additionalTopContent?: React.ReactNode;
  isAbleToAddRecord?: boolean;
  addButtonText?: string;
  onRecordAdd?: () => void;
  searchKey: string;
  page: number;
  pageSize: number;
  totalCount: number;
  searchFilter: string;
  onSearchChange: (query: string) => void;
  onPaginationChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export default function DataTable<T>({
  columns,
  data,
  renderCell,
  isLoading,
  page,
  pageSize,
  totalCount,
  searchFilter,
  searchKey,
  onSearchChange,
  onPaginationChange,
  onRowsPerPageChange,
  isAbleToAddRecord,
  addButtonText,
  onRecordAdd,
}: DataTableProps<T>) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const pages = Math.ceil(totalCount / pageSize);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      onPaginationChange(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      onPaginationChange(page - 1);
    }
  }, [page, pages]);

  const onClear = React.useCallback(() => {
    onSearchChange("");
    onPaginationChange(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 items-end">
            <Input
              ref={searchInputRef}
              isClearable
              className="w-full sm:max-w-[44%]"
              color="default"
              placeholder={`Search by ${searchKey}`}
              startContent={<SearchIcon />}
              // value={searchFilter}
              onClear={() => onClear()}
              onValueChange={() => {
                debounce(
                  () => onSearchChange(searchInputRef.current?.value!),
                  1000,
                )();
              }}
            />
            {isAbleToAddRecord && (
              <div className="flex gap-3">
                <Button color="primary" onPress={onRecordAdd}>
                  {addButtonText ? addButtonText : "Add"} <PlusIcon size={16} />{" "}
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              Total {totalCount} users
            </span>
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={(e) => {
                  onRowsPerPageChange(Number(e.target.value));
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
          </div>
        </div>
      </>
    );
  }, [
    searchFilter,
    onSearchChange,
    onRowsPerPageChange,
    data.length,
    pageSize,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400" />
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={onPaginationChange}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [data.length]);

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={!isLoading && bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px] bg-background",
      }}
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader className="bg-secondary-100" columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No items found"}
        isLoading={isLoading}
        items={data}
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={crypto.randomUUID()}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
