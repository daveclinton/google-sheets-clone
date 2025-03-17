import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FileRowProps {
  icon: "sheets" | "excel" | "docs" | "slides";
  id: string;
  title: string;
  owner: string;
  date: string;
  shared?: boolean;
  className?: string;
  actions?: React.ReactNode;
}

export function FileRow({
  id,
  icon,
  title,
  owner,
  date,
  shared = false,
  className,
  actions,
}: FileRowProps) {
  const getIconColor = () => {
    switch (icon) {
      case "sheets":
        return "#34a853";
      case "excel":
        return "#217346";
      case "docs":
        return "#4285f4";
      case "slides":
        return "#f4b400";
      default:
        return "#34a853";
    }
  };

  const getIconSvg = () => {
    switch (icon) {
      case "sheets":
      case "excel":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={getIconColor()}
            className="w-5 h-5"
          >
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
          </svg>
        );
      case "docs":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={getIconColor()}
            className="w-5 h-5"
          >
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9-2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          </svg>
        );
      case "slides":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={getIconColor()}
            className="w-5 h-5"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9-2-2zm0 16H5V5h14v14z" />
            <path d="M7 12h10v2H7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      href={{
        pathname: `/spreadsheets/${id}`,
        query: { title },
      }}
      className={cn(
        "flex items-center px-4 py-2 border-b last:border-b-0 group hover:bg-gray-50",
        className
      )}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="w-10 h-10 rounded flex items-center justify-center mr-3">
          {getIconSvg()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium truncate">{title}</h3>
          <div className="flex items-center mt-1">
            {owner === "me" ? (
              <span className="text-xs text-gray-500">me</span>
            ) : (
              <div className="flex items-center">
                {owner !== "--" && (
                  <Avatar className="h-4 w-4 mr-1">
                    <AvatarFallback className="text-[8px] bg-blue-100 text-blue-800">
                      {owner.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-xs text-gray-500">{owner}</span>
              </div>
            )}
            {shared && (
              <div className="flex items-center ml-2">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                <span className="text-xs text-gray-500">Shared</span>
              </div>
            )}
            <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
        </div>
      </div>
      {actions}
    </Link>
  );
}
