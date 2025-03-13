export interface Comment {
  id: string;
  cellId: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface Cell {
  id: string;
  row: number;
  col: number;
  value: string;
  hasComment: boolean;
}

export interface SheetData {
  cells: Record<string, Cell>;
  comments: Comment[];
}
