import SpreadsheetPage from "./SpreadsheetPage";

type Cell = {
  value: string;
};

const getColumnLabel = (index: number): string => {
  return String.fromCharCode(65 + index);
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const createEmptyCell = (): Cell => {
  return {
    value: "",
  };
};

function makeEmptyData(rows: number, cols: number) {
  return range(rows).map(() => {
    const rowData: Record<string, Cell> = {};
    for (let i = 0; i < cols; i++) {
      rowData[getColumnLabel(i)] = createEmptyCell();
    }
    return rowData;
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string }>;
}) {
  const { id } = await params;
  const { title } = await searchParams;
  const initialData = await fetch(`https://.../spreadsheets/${id}`)
    .then((res) => res.json())
    .catch(() => makeEmptyData(100, 26));

  return (
    <SpreadsheetPage
      id={id}
      initialData={initialData}
      initialTitle={title || "Untitled spreadsheet"}
    />
  );
}
