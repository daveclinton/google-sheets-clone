export const sampleFiles = [
  {
    id: "ef414092-41e4-4215-b1b5-d5702fc17fc8",
    title: "Intergalactic Trade Routes",
    owner: "Alice",
    date: "2025-03-13",
    shared: false,
    starred: false,
    type: "sheets",
  },
  {
    id: "979b9a3a-7138-4438-b32e-4862e814d948",
    title: "Bucket List - Extreme Edition",
    owner: "Bob",
    date: "2025-03-07",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "bd76a610-edc6-4f64-9bc7-6234b0be37f2",
    title: "Underground Pizza Spots",
    owner: "Charlie",
    date: "2025-02-09",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "f3c67641-aee2-4b5e-b89a-84e2fcd4ca9c",
    title: "Conspiracy Theories with 99% Proof",
    owner: "David",
    date: "2025-02-04",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "f5b09111-93bb-4b2d-9d8a-309acdb034c8",
    title: "Top Secret Alien Sightings Log",
    owner: "Eve",
    date: "2024-06-26",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "bc95c8aa-7087-4030-97ff-aa7f04a3234e",
    title: "Fastest Ways to Get Rich (Legally?)",
    owner: "Mysterious Millionaire",
    date: "2024-05-15",
    shared: true,
    starred: false,
    type: "sheets",
  },
];

export type Cell = {
  value: string;
};

export const getColumnLabel = (index: number): string => {
  return String.fromCharCode(65 + index);
};

export const range = (len: number) => {
  return Array.from({ length: len }, (_, i) => i);
};

const sampleData = [
  ["Alice", "Sales", "2024-01-01", "100"],
  ["Bob", "Marketing", "2024-02-02", "200"],
  ["Charlie", "Support", "2024-03-03", "300"],
  ["Diana", "Dev", "2024-04-04", "400"],
  ["Eve", "HR", "2024-05-05", "500"],
];

export function makeSampleData(rows: number, cols: number) {
  return range(rows).map((rowIndex) => {
    const rowData: Record<string, Cell> = {};
    for (let i = 0; i < cols; i++) {
      const columnLabel = getColumnLabel(i);
      rowData[columnLabel] = {
        value: sampleData[rowIndex % sampleData.length][i],
      };
    }
    return rowData;
  });
}
