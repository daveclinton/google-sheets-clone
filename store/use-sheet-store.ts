import { create } from "zustand";
import { faker } from "@faker-js/faker";

const generateSampleCells = (
  rows: number,
  cols: number
): Record<string, Cell> => {
  const sampleCells: Record<string, Cell> = {};
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellId = `${row}-${col}`;
      sampleCells[cellId] = {
        id: cellId,
        row,
        col,
        value:
          Math.random() > 0.5
            ? faker.helpers.arrayElement([
                faker.person.firstName(),
                faker.number.int({ min: 1, max: 100 }).toString(),
                faker.lorem.word(),
              ])
            : "",
        hasComment: Math.random() > 0.9,
      };
    }
  }
  return sampleCells;
};

interface Cell {
  id: string;
  row: number;
  col: number;
  value: string;
  hasComment: boolean;
}

export interface SheetState {
  cells: Record<string, Cell>;
  selectedCell: Cell | null;
  filename: string;
  setCellValue: (row: number, col: number, value: string) => void;
  setSelectedCell: (cell: Cell | null) => void;
  setFilename: (filename: string) => void;
}

const ROWS: number = 100;
const COLS: number = 26;

// Initialize store with fake data
export const useSheetStore = create<SheetState>((set) => ({
  cells: generateSampleCells(ROWS, COLS),
  selectedCell: null,
  filename: "Untitled spreadsheet",
  setCellValue: (row: number, col: number, value: string) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [`${row}-${col}`]: {
          ...state.cells[`${row}-${col}`],
          value,
        },
      },
    })),
  setSelectedCell: (cell) => set({ selectedCell: cell }),
  setFilename: (filename) => set({ filename }),
}));
