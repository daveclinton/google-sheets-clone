"use client";

import React, { useRef, useMemo, useCallback, JSX } from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Download, Settings, FileSpreadsheet } from "lucide-react";

interface Cell {
  id: string;
  row: number;
  col: number;
  value: string;
  hasComment: boolean;
}

interface Comment {
  id: string;
  cellId: string;
  content: string;
  author: string;
  createdAt: string;
}

interface SheetState {
  cells: Record<string, Cell>;
  comments: Comment[];
  selectedCell: Cell | null;
  filename: string;
  setCellValue: (row: number, col: number, value: string) => void;
  setSelectedCell: (cell: Cell | null) => void;
  addComment: (cellId: string, content: string) => void;
  setFilename: (filename: string) => void;
}

// Constants
const ROWS: number = 100;
const COLS: number = 26;
const INITIAL_VISIBLE_ROWS: number = 30;

// Zustand Store
const useSheetStore = create<SheetState>((set) => {
  const cells: Record<string, Cell> = {};
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cellId: string = `${row}-${col}`;
      cells[cellId] = {
        id: cellId,
        row,
        col,
        value: "",
        hasComment: cellId === "0-0",
      };
    }
  }

  return {
    cells,
    comments: [
      {
        id: uuidv4(),
        cellId: "0-0",
        content: "Sample",
        author: "John",
        createdAt: "2025-03-13T10:00:00",
      },
    ],
    selectedCell: null,
    filename: "Untitled spreadsheet",
    setCellValue: (row: number, col: number, value: string): void =>
      set((state: SheetState) => ({
        cells: {
          ...state.cells,
          [`${row}-${col}`]: {
            ...state.cells[`${row}-${col}`],
            value,
          },
        },
      })),
    setSelectedCell: (cell: Cell | null): void => set({ selectedCell: cell }),
    addComment: (cellId: string, content: string): void =>
      set((state: SheetState) => ({
        comments: [
          ...state.comments,
          {
            id: uuidv4(),
            cellId,
            content,
            author: "User",
            createdAt: new Date().toISOString(),
          },
        ],
        cells: {
          ...state.cells,
          [cellId]: {
            ...state.cells[cellId],
            hasComment: true,
          },
        },
      })),
    setFilename: (filename: string): void => set({ filename }),
  };
});

const SheetPage: React.FC = (): JSX.Element => {
  const {
    cells,
    comments,
    selectedCell,
    filename,
    setCellValue,
    setSelectedCell,
    addComment,
    setFilename,
  }: SheetState = useSheetStore();
  const [commentInput, setCommentInput] = React.useState<string>("");
  const measureRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCellId = useCallback(
    (row: number, col: number): string => `${row}-${col}`,
    []
  );

  const getCommentsForCell = useCallback(
    (cellId: string): Comment[] =>
      comments.filter((comment: Comment) => comment.cellId === cellId),
    [comments]
  );

  const handleCellClick = useCallback(
    (row: number, col: number): void => {
      const cellId: string = getCellId(row, col);
      setSelectedCell(cells[cellId]);
    },
    [cells, setSelectedCell, getCellId]
  );

  const handleTitleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>): void => {
      e.target.select();
    },
    []
  );

  const visibleGrid: JSX.Element[] = useMemo(() => {
    const rows: JSX.Element[] = [];
    for (let row = 0; row < INITIAL_VISIBLE_ROWS; row++) {
      const cellsRow: JSX.Element[] = [
        <div
          key={`row-${row}`}
          className={`bg-gray-200 border-b border-r w-10 h-6 flex items-center justify-center font-medium sticky left-0 z-10 ${
            selectedCell?.row === row ? "bg-gray-300" : ""
          }`}
        >
          {row + 1}
        </div>,
      ];
      for (let col = 0; col < COLS; col++) {
        const cellId: string = getCellId(row, col);
        const cell: Cell = cells[cellId];
        const hasComments: boolean = getCommentsForCell(cellId).length > 0;
        cellsRow.push(
          <div
            key={`cell-${row}-${col}`}
            className={`border-b border-r h-6 relative ${
              selectedCell?.id === cellId
                ? "outline outline-2 outline-blue-500 z-10"
                : ""
            }`}
            onClick={(): void => handleCellClick(row, col)}
          >
            <input
              type="text"
              value={cell.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setCellValue(row, col, e.target.value)
              }
              className="w-full h-full px-2 focus:outline-none text-sm"
            />
            {hasComments && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-orange-400"></div>
            )}
          </div>
        );
      }
      rows.push(<React.Fragment key={`row-${row}`}>{cellsRow}</React.Fragment>);
    }
    return rows;
  }, [
    cells,
    selectedCell,
    handleCellClick,
    getCellId,
    getCommentsForCell,
    setCellValue,
  ]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="relative">
              <span
                ref={measureRef}
                className="invisible absolute whitespace-pre"
                style={{ fontWeight: 500, fontSize: "1.125rem" }}
              >
                {filename}
              </span>
              <Input
                ref={inputRef}
                value={filename}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setFilename(e.target.value)
                }
                onFocus={handleTitleFocus}
                className="text-lg font-medium h-9 focus-visible:ring-1 px-2 py-1"
                style={{
                  width: `${
                    Math.max(measureRef.current?.offsetWidth || 0, 120) + 24
                  }px`,
                  minWidth: "20px",
                  maxWidth: "400px",
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>All changes saved</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center p-1 border-b bg-gray-50">
        <div className="flex items-center gap-1 px-2">
          {(
            [
              "File",
              "Edit",
              "View",
              "Insert",
              "Format",
              "Data",
              "Tools",
              "Help",
            ] as const
          ).map((item: string) => (
            <Button key={item} variant="ghost" size="sm" className="text-xs">
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* Formula bar */}
      <div className="flex items-center p-1 border-b bg-white">
        <div className="flex items-center gap-2 px-2 w-full">
          <div className="min-w-[60px] text-sm font-medium text-gray-500">
            {selectedCell
              ? `${String.fromCharCode(65 + selectedCell.col)}${
                  selectedCell.row + 1
                }`
              : ""}
          </div>
          <Input
            value={selectedCell ? cells[selectedCell.id].value : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              if (selectedCell?.id) {
                setCellValue(
                  selectedCell.row,
                  selectedCell.col,
                  e.target.value
                );
              }
            }}
            className="flex-grow h-8"
            placeholder="Enter cell content"
          />
        </div>
      </div>

      {/* Grid and Comments */}
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow overflow-auto" ref={gridRef}>
          <div className="grid grid-cols-[40px_repeat(26,minmax(100px,1fr))] overflow-x-auto">
            <div className="bg-gray-200 border-b border-r h-6 flex items-center justify-center sticky top-0 left-0 z-20"></div>
            {Array.from({ length: COLS }, (_, col: number) => (
              <div
                key={`col-${col}`}
                className={`bg-gray-200 border-b border-r h-6 flex items-center justify-center font-medium sticky top-0 z-10 ${
                  selectedCell?.col === col ? "bg-gray-300" : ""
                }`}
              >
                {String.fromCharCode(65 + col)}
              </div>
            ))}
            {visibleGrid}
          </div>
        </div>

        {/* Comments Panel */}
        {selectedCell && getCommentsForCell(selectedCell.id).length > 0 && (
          <div className="w-80 bg-white border-l shadow-lg flex flex-col h-full">
            <div className="p-2 bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Comments</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(): void => setSelectedCell(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-3">
              {getCommentsForCell(selectedCell.id).map((comment: Comment) => (
                <div key={comment.id} className="border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs font-medium">
                        {comment.author}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
            <div className="p-2 border-t">
              <textarea
                value={commentInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
                  setCommentInput(e.target.value)
                }
                placeholder="Add a comment..."
                className="w-full p-2 border rounded text-sm resize-none"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={(): void => {
                    if (selectedCell && commentInput.trim()) {
                      addComment(selectedCell.id, commentInput);
                      setCommentInput("");
                    }
                  }}
                  disabled={!commentInput.trim()}
                  className="flex-1 text-sm"
                >
                  Comment
                </Button>
                <Button variant="outline" className="flex-1 text-sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between p-1 border-t bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center gap-4 px-2">
          <div>Sheet 1</div>
          <div>
            {Object.values(cells).filter((cell: Cell) => cell.value).length}{" "}
            cells with data
          </div>
        </div>
        <div className="px-2">
          {selectedCell &&
            `Selected: ${String.fromCharCode(65 + selectedCell.col)}${
              selectedCell.row + 1
            }`}
        </div>
      </div>
    </div>
  );
};

export default SheetPage;
