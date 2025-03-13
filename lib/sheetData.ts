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

export const sampleFiles = [
  {
    id: "ef414092-41e4-4215-b1b5-d5702fc17fc8",
    title: "Untitled spreadsheet",
    owner: "me",
    date: "2025-03-13 19:57:00",
    shared: false,
    starred: false,
    type: "sheets",
  },
  {
    id: "979b9a3a-7138-4438-b32e-4862e814d948",
    title: "To-do list",
    owner: "me",
    date: "2025-03-07",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "bd76a610-edc6-4f64-9bc7-6234b0be37f2",
    title: "Kenyan Indie Maker Community top talent",
    owner: "Peter Okwara",
    date: "2025-02-09",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "f3c67641-aee2-4b5e-b89a-84e2fcd4ca9c",
    title: "Case Numbers in each 1000 for all consulates",
    owner: "--",
    date: "2025-02-04",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "f5b09111-93bb-4b2d-9d8a-309acdb034c8",
    title: "Injured & deceased protestors",
    owner: "--",
    date: "2024-06-26",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "bc95c8aa-7087-4030-97ff-aa7f04a3234e",
    title: "Finance Bill 2024 Voting",
    owner: "--",
    date: "2024-06-20",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "79c3d8c1-a041-4e77-a6a2-cdf3b1328e1f",
    title: "Remote/Frontend Jobs",
    owner: "Vishal Rajput",
    date: "2023-10-04",
    shared: true,
    starred: true,
    type: "sheets",
  },
  {
    id: "57b779fe-7382-4ff7-836d-020fae0fff06",
    title: "Event Registration (Responses)",
    owner: "me",
    date: "2023-04-17",
    shared: false,
    starred: false,
    type: "sheets",
  },
];
