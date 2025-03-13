// lib/sheetData.ts
import { SheetData, Cell, Comment } from "@/app/types/types";
import { v4 as uuidv4 } from "uuid";

// In a real application, this would be replaced with a database
// This is a simple in-memory store that persists during the server's lifetime
let sheetData: SheetData = {
  cells: {},
  comments: [],
};

// Initialize data
(() => {
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      const cellId = `${row}-${col}`;
      sheetData.cells[cellId] = {
        id: cellId,
        row,
        col,
        value: "",
        hasComment: false,
      };
    }
  }
})();

// Helper functions to interact with the data
export function getSheetData(): SheetData {
  return JSON.parse(JSON.stringify(sheetData)); // Return a deep copy
}

export function updateSheetData(data: SheetData): void {
  sheetData = data;
}

export function getCell(cellId: string): Cell | null {
  return sheetData.cells[cellId] || null;
}

export function updateCell(
  cellId: string,
  updates: Partial<Cell>
): Cell | null {
  if (!sheetData.cells[cellId]) {
    return null;
  }

  sheetData.cells[cellId] = {
    ...sheetData.cells[cellId],
    ...updates,
  };

  return sheetData.cells[cellId];
}

export function getCommentsForCell(cellId: string): Comment[] {
  return sheetData.comments.filter((comment) => comment.cellId === cellId);
}

export function addComment(
  cellId: string,
  content: string,
  author: string
): Comment | null {
  if (!sheetData.cells[cellId]) {
    return null;
  }

  const comment: Comment = {
    id: uuidv4(),
    cellId,
    content,
    author,
    createdAt: new Date(),
  };

  sheetData.comments.push(comment);
  sheetData.cells[cellId].hasComment = true;

  return comment;
}

export function deleteComment(commentId: string): boolean {
  const commentIndex = sheetData.comments.findIndex((c) => c.id === commentId);

  if (commentIndex === -1) {
    return false;
  }

  const deletedComment = sheetData.comments[commentIndex];
  sheetData.comments.splice(commentIndex, 1);

  // Check if there are still comments for this cell
  const cellHasComments = sheetData.comments.some(
    (c) => c.cellId === deletedComment.cellId
  );
  if (!cellHasComments) {
    sheetData.cells[deletedComment.cellId].hasComment = false;
  }

  return true;
}
