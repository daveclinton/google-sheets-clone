"use client";

import React, { useRef, useMemo, useCallback, JSX, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/app/features/header";
import { useSheetStore } from "@/app/store";
import { useParams, useSearchParams } from "next/navigation";
import {
  VeltCommentTool,
  VeltCommentBubble,
  useSetDocument,
} from "@veltdev/react";

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

const COLS: number = 26;
const INITIAL_VISIBLE_ROWS: number = 40;

const SheetPage: React.FC = (): JSX.Element => {
  const searchParams = useSearchParams();
  const parmas = useParams();
  const urlTitle = searchParams.get("title");

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

  useEffect(() => {
    if (urlTitle) {
      setFilename(urlTitle);
    }
  }, [urlTitle, setFilename]);

  useSetDocument(parmas?.id as string, { documentName: filename });

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
        cellsRow.push(
          <div
            key={`cell-${row}-${col}`}
            className={`border-b border-r h-6 relative ${
              selectedCell?.id === cellId
                ? " outline-2 outline-blue-500 z-10"
                : ""
            }`}
            onClick={(): void => handleCellClick(row, col)}
            id={`cell-${cellId}`}
            data-velt-target-comment-element-id={`cell-${cellId}`}
          >
            <input
              type="text"
              value={cell.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setCellValue(row, col, e.target.value)
              }
              className="w-full h-full px-2 focus:outline-none text-sm"
            />
            <VeltCommentBubble
              targetElementId={`cell-${cellId}`}
              className="absolute top-0 right-0 w-2 h-2"
            />
          </div>
        );
      }
      rows.push(<React.Fragment key={`row-${row}`}>{cellsRow}</React.Fragment>);
    }
    return rows;
  }, [cells, selectedCell, handleCellClick, getCellId, setCellValue]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        type="sheets"
        measureRef={measureRef}
        filename={urlTitle || filename}
        inputRef={inputRef}
        setFilename={setFilename}
        handleTitleFocus={handleTitleFocus}
      />

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
            className="flex-grow h-8 "
            placeholder="Enter cell content"
          />
          <VeltCommentTool />
        </div>
      </div>

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
