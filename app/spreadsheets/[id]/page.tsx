import { makeSampleData } from "@/lib/sheetData";
import SpreadsheetPage from "./SpreadsheetPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string }>;
}) {
  const { id } = await params;
  const { title } = await searchParams;
  const initialData = await Promise.resolve(makeSampleData(20, 10));
  return (
    <SpreadsheetPage
      id={id}
      initialData={initialData}
      initialTitle={title || "Untitled spreadsheet"}
    />
  );
}
