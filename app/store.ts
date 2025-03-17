import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  organizationId: string;
  colorCode: string;
  textColor: string;
};

export interface UserStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  generateRandomUser: () => User;
}

const userIds = [
  "user001",
  "user002",
  "user003",
  "user004",
  "user005",
  "user006",
  "user007",
  "user008",
  "user009",
  "user010",
];

const generateRandomUser = (): User => {
  const randomIndex = Math.floor(Math.random() * userIds.length);
  const uid = userIds[randomIndex];
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Zara",
    "Milo",
    "Nova",
    "Kai",
    "Riley",
  ];
  const randomName = names[randomIndex];
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const randomTextColor = getContrastColor(randomColor);

  return {
    uid: uid,
    displayName: randomName,
    email: `${randomName.toLowerCase()}@example.com`,
    photoURL: `https://picsum.photos/seed/${uid}/200/300`,
    organizationId: `org-${uid}`,
    colorCode: randomColor,
    textColor: randomTextColor,
  };
};

const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      generateRandomUser: () => {
        const user = generateRandomUser();
        return user;
      },
    }),
    {
      name: "user-storage",
    }
  )
);

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

export const useSheetStore = create<SheetState>((set) => {
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
    setFilename: (filename: string): void => set({ filename }),
  };
});
