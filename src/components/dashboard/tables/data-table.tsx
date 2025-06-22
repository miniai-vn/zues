"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PaginationMeta {
  page: number;
  limit: number;
  total?: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationMeta;
  onPaginationChange?: (page: number) => void;
  onPageSizeChange?: (limit: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onRowClick?: (row: TData) => void; // Thêm dòng này
  isLoading?: boolean;
  noResultsMessage?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
  onPageSizeChange,
  onSortingChange,
  onRowSelectionChange,
  onRowClick,
  isLoading = false,
  noResultsMessage,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hasServerPagination = Boolean(pagination && onPaginationChange);
  const totalItems = pagination?.total || data.length;
  const pageSize = pagination?.limit || 10;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = pagination?.page || 1;

  const handleSortingChange = (updatedSorting: SortingState) => {
    setSorting(updatedSorting);
    if (onSortingChange) {
      onSortingChange(updatedSorting);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  useEffect(() => {
    if (!hasServerPagination) {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      setFilteredData(data.slice(start, end));
    } else {
      setFilteredData(data);
    }
  }, [data, currentPage, pageSize, hasServerPagination]);

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = Object.keys(rowSelection).map(
        (key) => filteredData[parseInt(key)]
      );
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, filteredData, onRowSelectionChange]);

  const columnsWithSelection = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      size: 40,
    },
    ...columns,
  ];

  const table = useReactTable({
    data: filteredData,
    columns: columnsWithSelection,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updaterOrValue) => {
      const updatedSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;
      handleSortingChange(updatedSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: Boolean(onSortingChange),
  });

  const handlePageChange = (newPage: number) => {
    if (onPaginationChange) {
      onPaginationChange(newPage);
    }
  };

  // Thêm biến để xác định cột không cho phép onRowClick
  const ACTION_COLUMN_IDS = ["actions", "delete", "update"];

  // Mobile Card Component
  const MobileCard = ({ row }: { row: any }) => (
    <Card
      className={cn(
        "mb-3 cursor-pointer transition-colors hover:bg-muted/50",
        row.getIsSelected() && "bg-muted"
      )}
      onClick={() => onRowClick?.(row.original)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row"
          />
          <div className="flex gap-2">
            {/* Render action buttons from the actions column */}
            {row
              .getVisibleCells()
              .filter((cell: any) => ACTION_COLUMN_IDS.includes(cell.column.id))
              .map((cell: any) => (
                <div key={cell.id} onClick={(e) => e.stopPropagation()}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-2">
          {row
            .getVisibleCells()
            .filter(
              (cell: any) =>
                !ACTION_COLUMN_IDS.includes(cell.column.id) &&
                cell.column.id !== "select"
            )
            .map((cell: any) => {
              const columnHeader = flexRender(
                cell.column.columnDef.header,
                cell.getContext()
              );

              return (
                <div
                  key={cell.id}
                  className="flex justify-between items-center py-1"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {columnHeader}:
                  </span>
                  <span className="text-sm text-right max-w-[60%] truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="rounded-md border flex flex-col h-full">
      <div className="relative flex-1 min-h-0 overflow-auto">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {isMobile ? (
          // Mobile view - Card layout
          <div className="p-4">
            {table.getRowModel().rows?.length ? (
              <div className="space-y-3">
                {table.getRowModel().rows.map((row) => (
                  <MobileCard key={row.id} row={row} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {isLoading
                    ? ""
                    : noResultsMessage || t("noResults", "No results.")}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Desktop view - Table layout
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "whitespace-nowrap",
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={(e) => {
                        // Nếu click vào cell thuộc cột trong ACTION_COLUMN_IDS thì không gọi onRowClick
                        const cell = (e.target as HTMLElement).closest("td");
                        if (
                          cell &&
                          ACTION_COLUMN_IDS.some(
                            (colId) =>
                              cell.getAttribute("data-column-id") === colId
                          )
                        ) {
                          return;
                        }
                        onRowClick?.(row.original);
                      }}
                      className={cn(
                        "cursor-pointer hover:bg-muted/50",
                        onRowClick ? "cursor-pointer" : ""
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          data-column-id={cell.column.id}
                          className="whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center h-32"
                    >
                      {isLoading
                        ? ""
                        : noResultsMessage || t("noResults", "No results.")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {hasServerPagination && (
        <div className="flex items-center justify-between px-4 py-4 border-t flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}
                disabled={isLoading}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={String(pageSize)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs hidden sm:inline">
                {t("rowsPerPage", "Rows per page")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile pagination - simplified */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>

            {/* Desktop pagination - full */}
            <div className="hidden sm:block">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1 || isLoading}
                      className={
                        currentPage === 1 || isLoading
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                      isActive={currentPage === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {Array.from({ length: 3 }, (_, i) => {
                    const pageNumber = currentPage - 1 + i;
                    if (pageNumber <= 1 || pageNumber >= totalPages)
                      return null;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                        isActive={currentPage === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      aria-disabled={currentPage >= totalPages || isLoading}
                      className={
                        currentPage >= totalPages || isLoading
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
