"use client";

import React, { useState, useEffect, useRef } from "react";

import { v4 as uuidv4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Download, Settings, FileSpreadsheet } from "lucide-react";

// Types
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
  createdAt: Date;
}

interface SheetData {
  cells: { [key: string]: Cell };
  comments: Comment[];
}

export default function SheetPage() {
  const [data, setData] = useState<SheetData>({
    cells: {},
    comments: [],
  });

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [user] = useState("User");
  const [filename, setFilename] = useState("Untitled spreadsheet");
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const initialData: SheetData = {
        cells: {},
        comments: [],
      };
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          const cellId = `${row}-${col}`;
          initialData.cells[cellId] = {
            id: cellId,
            row,
            col,
            value: "",
            hasComment: false,
          };
        }
      }

      setData(initialData);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getCellId = (row: number, col: number): string => {
    return `${row}-${col}`;
  };

  const handleCellClick = (row: number, col: number) => {
    const cellId = getCellId(row, col);
    const cell = data.cells[cellId];
    setSelectedCell(cell);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const cellId = getCellId(row, col);

    setData((prev) => ({
      ...prev,
      cells: {
        ...prev.cells,
        [cellId]: {
          ...prev.cells[cellId],
          value,
        },
      },
    }));
  };

  const addComment = () => {
    if (!selectedCell || !commentInput.trim()) return;

    const newComment: Comment = {
      id: uuidv4(),
      cellId: selectedCell.id,
      content: commentInput,
      author: user,
      createdAt: new Date(),
    };

    setData((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
      cells: {
        ...prev.cells,
        [selectedCell.id]: {
          ...prev.cells[selectedCell.id],
          hasComment: true,
        },
      },
    }));

    setCommentInput("");
  };

  const getCommentsForCell = (cellId: string): Comment[] => {
    return data.comments.filter((comment) => comment.cellId === cellId);
  };

  const deleteComment = (commentId: string) => {
    setData((prev) => {
      const newComments = prev.comments.filter(
        (comment) => comment.id !== commentId
      );
      const updatedCells = { ...prev.cells };

      const cellsWithComments = new Set(
        newComments.map((comment) => comment.cellId)
      );

      Object.keys(updatedCells).forEach((cellId) => {
        if (updatedCells[cellId].hasComment && !cellsWithComments.has(cellId)) {
          updatedCells[cellId] = {
            ...updatedCells[cellId],
            hasComment: false,
          };
        }
      });

      return {
        ...prev,
        comments: newComments,
        cells: updatedCells,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium">Loading spreadsheet...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with filename and user */}
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
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
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
            <AvatarImage src="/placeholder.svg" alt={user} />
            <AvatarFallback>{user.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center p-1 border-b bg-gray-50">
        <div className="flex items-center gap-1 px-2">
          <Button variant="ghost" size="sm" className="text-xs">
            File
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            View
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Insert
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Format
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Data
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Tools
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Help
          </Button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow overflow-auto">
          <div className="grid grid-cols-[40px_repeat(10,minmax(100px,1fr))]">
            <div className="bg-gray-200 border-b border-r h-10 flex items-center justify-center"></div>
            {Array(10)
              .fill(0)
              .map((_, col) => (
                <div
                  key={`col-${col}`}
                  className="bg-gray-200 border-b border-r h-10 flex items-center justify-center font-medium"
                >
                  {String.fromCharCode(65 + col)}
                </div>
              ))}
            {Array(20)
              .fill(0)
              .map((_, row) => (
                <React.Fragment key={`row-${row}`}>
                  <div className="bg-gray-200 border-b border-r w-10 h-10 flex items-center justify-center font-medium">
                    {row + 1}
                  </div>
                  {Array(10)
                    .fill(0)
                    .map((_, col) => {
                      const cellId = getCellId(row, col);
                      const cell = data.cells[cellId];

                      return (
                        <div
                          key={`cell-${row}-${col}`}
                          className={`border-b border-r h-10 relative ${
                            selectedCell?.id === cellId
                              ? "outline outline-blue-500 z-10"
                              : ""
                          }`}
                          onClick={() => handleCellClick(row, col)}
                        >
                          <input
                            type="text"
                            value={cell?.value || ""}
                            onChange={(e) =>
                              handleCellChange(row, col, e.target.value)
                            }
                            className="w-full h-full px-2 focus:outline-none"
                          />
                          {cell?.hasComment && (
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-4 border-r-4 border-t-transparent border-r-red-500"></div>
                          )}
                        </div>
                      );
                    })}
                </React.Fragment>
              ))}
          </div>
        </div>

        <div
          className={`w-80 border-l border-gray-300 flex flex-col bg-gray-50 ${
            selectedCell ? "block" : "hidden sm:block"
          }`}
        >
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-medium">Comments</h2>
            {selectedCell && (
              <div className="text-sm text-gray-500">
                Cell: {String.fromCharCode(65 + selectedCell.col)}
                {selectedCell.row + 1}
              </div>
            )}
          </div>

          <div className="flex-grow overflow-auto p-4">
            {selectedCell ? (
              getCommentsForCell(selectedCell.id).length > 0 ? (
                getCommentsForCell(selectedCell.id).map((comment) => (
                  <div
                    key={comment.id}
                    className="mb-4 bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">{comment.author}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-1">{comment.content}</div>
                    <button
                      className="text-xs text-red-500 mt-2"
                      onClick={() => deleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center mt-4">
                  No comments for this cell
                </div>
              )
            ) : (
              <div className="text-gray-500 text-center mt-4">
                Select a cell to view comments
              </div>
            )}
          </div>

          {selectedCell && (
            <div className="p-4 border-t mt-auto">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-lg mb-2 resize-none"
                rows={3}
              />
              <button
                onClick={addComment}
                disabled={!commentInput.trim()}
                className={`px-4 py-2 rounded-lg w-full ${
                  !commentInput.trim()
                    ? "bg-gray-300 text-gray-500"
                    : "bg-blue-500 text-white"
                }`}
              >
                Add Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between p-1 border-t bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center gap-4 px-2">
          <div>Sheet 1</div>
          <div>
            {Object.values(data.cells).filter((cell) => cell.value).length}{" "}
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
}
