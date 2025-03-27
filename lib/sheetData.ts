export const sampleFiles = [
  {
    id: "ef414092-41e4-4215-b1b5-d5702fc17fc8",
    title: "Intergalactic Trade Routes",
    owner: "Alice",
    date: "2025-03-13 19:57:00",
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
    date: "Zara",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: "79c3d8c1-a041-4e77-a6a2-cdf3b1328e1f",
    title: "Fantasy Football Cheat Sheet 2024",
    owner: "Milo",
    date: "2023-10-04",
    shared: true,
    starred: true,
    type: "sheets",
  },
  {
    id: "57b779fe-7382-4ff7-836d-020fae0fff06",
    title: "Best Excuses for Calling in Sick",
    owner: "Nova",
    date: "2023-04-17",
    shared: false,
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
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const sampleNames = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
];
const sampleCategories = ["Sales", "Marketing", "Support", "Dev", "HR"];
const sampleDates = () =>
  new Date(
    2024,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  )
    .toISOString()
    .split("T")[0];
const sampleNumber = () => Math.floor(Math.random() * 1000).toString();

export function makeSampleData(rows: number, cols: number) {
  return range(rows).map((rowIndex) => {
    const rowData: Record<string, Cell> = {};
    for (let i = 0; i < cols; i++) {
      const columnLabel = getColumnLabel(i);
      let value: string;

      // Assign meaningful data based on column
      switch (columnLabel) {
        case "A": // Names
          value = sampleNames[rowIndex % sampleNames.length];
          break;
        case "B": // Categories
          value = sampleCategories[rowIndex % sampleCategories.length];
          break;
        case "C": // Dates
          value = sampleDates();
          break;
        case "D": // Numbers (e.g., sales amount)
          value = sampleNumber();
          break;
        default: // Random text or numbers for other columns
          value = i % 2 === 0 ? sampleNumber() : `Item ${rowIndex + 1}-${i}`;
          break;
      }

      rowData[columnLabel] = { value };
    }
    return rowData;
  });
}
