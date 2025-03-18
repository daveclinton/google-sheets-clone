/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useEffect } from "react";
import {
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/app/features/header";
import {
  VeltComments,
  VeltCommentTool,
  VeltCommentBubble,
  useSetDocument,
} from "@veltdev/react";

export type Cell = {
  value: string;
};

const getColumnLabel = (index: number): string => {
  return String.fromCharCode(65 + index);
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const createEmptyCell = (): Cell => {
  return {
    value: "",
  };
};

function makeEmptyData(rows: number, cols: number) {
  return range(rows).map(() => {
    const rowData: Record<string, Cell> = {};
    for (let i = 0; i < cols; i++) {
      rowData[getColumnLabel(i)] = createEmptyCell();
    }
    return rowData;
  });
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: Cell) => void;
  }
}

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

function EditableCell<TData extends Record<string, Cell>>({
  getValue,
  row,
  column,
  table,
}: {
  getValue: () => unknown;
  row: { index: number };
  column: { id: string };
  table: Table<TData>;
}) {
  const initialValue = (getValue() as Cell)?.value || "";
  const [value, setValue] = React.useState(initialValue);
  const cellId = `cell-${row.index}-${column.id}`;

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, { value });
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="relative w-full h-full" id={cellId}>
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="w-full h-full border-none focus:outline-none bg-transparent px-1 py-0"
      />
      <VeltCommentBubble targetElementId={cellId} />
    </div>
  );
}

export default function Page() {
  const COLUMNS_COUNT = 26;
  const DEFAULT_ROWS_COUNT = 100;
  const CELL_WIDTH = 600;

  const searchParams = useSearchParams();
  const urlTitle = searchParams.get("title");
  const params = useParams();

  const [filename, setFilename] = React.useState<string>(
    "Untitled spreadsheet"
  );

  const measureRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultColumn: Partial<ColumnDef<Record<string, Cell>>> = {
    cell: (props) => <EditableCell<Record<string, Cell>> {...props} />,
    size: CELL_WIDTH,
  };

  const columns = React.useMemo<ColumnDef<Record<string, Cell>>[]>(() => {
    return range(COLUMNS_COUNT).map((i) => {
      const columnLabel = getColumnLabel(i);
      return {
        accessorKey: columnLabel,
        header: () => <div className="text-center">{columnLabel}</div>,
        size: CELL_WIDTH,
      };
    });
  }, []);

  const [data, setData] = React.useState(() =>
    makeEmptyData(DEFAULT_ROWS_COUNT, COLUMNS_COUNT)
  );
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
    autoResetPageIndex,
    meta: {
      updateData: (rowIndex: number, columnId: string, value: Cell) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value as Cell,
              } as Record<string, Cell>;
            }
            return row;
          })
        );
      },
    },
  });

  useEffect(() => {
    if (urlTitle) {
      setFilename(urlTitle);
    }
  }, [urlTitle, setFilename]);

  useSetDocument(params?.id as string, { documentName: filename });

  const handleTitleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-xs">
      <VeltComments popoverMode={true} />

      <Header
        type="sheets"
        measureRef={measureRef}
        filename={urlTitle || filename}
        inputRef={inputRef}
        setFilename={setFilename}
        handleTitleFocus={handleTitleFocus}
      />

      <div className="flex justify-end px-4 py-1 bg-gray-50 border-b border-gray-200">
        <VeltCommentTool />
      </div>

      <div className="flex border-b border-gray-200 sticky top-0 bg-gray-100 z-10">
        <div className="w-10 flex items-center justify-center border-r border-gray-200 bg-gray-100 text-gray-500">
          #
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className="flex">
            {table.getFlatHeaders().map((header) => (
              <div
                key={header.id}
                style={{ width: `${header.getSize()}px` }}
                className="border-r border-gray-200 h-6 flex items-center justify-center bg-gray-100 text-gray-700 font-medium"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </div>
            ))}
            <div className="w-full h-6 bg-gray-100"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto" ref={gridRef}>
        <div className="flex">
          <div className="w-10 sticky left-0 bg-gray-100 z-10">
            {table.getRowModel().rows.map((row, i) => (
              <div
                key={row.id}
                className="h-6 border-b border-r border-gray-200 flex items-center justify-center text-gray-500"
              >
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  i +
                  1}
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-x-auto">
            <div>
              {table.getRowModel().rows.map((row) => (
                <div key={row.id} className="flex border-b border-gray-200">
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      style={{ width: `${cell.column.getSize()}px` }}
                      className="border-r border-gray-200 h-6 overflow-hidden"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                  <div className="w-full h-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-2 px-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1 text-xs disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="border rounded p-1 text-xs disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <span className="text-xs">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </div>
        <span className="text-xs">{table.getRowModel().rows.length} rows</span>
      </div>
    </div>
  );
}
