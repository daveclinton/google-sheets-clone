import Image from "next/image";
import Link from "next/link";

interface TemplateCardProps {
  image?: string;
  icon?: React.ReactNode;
  title: string;
  className?: string;
}

export function TemplateCard({
  image,
  icon,
  title,
  className = "bg-white",
}: TemplateCardProps) {
  // Generate a unique ID based on the title
  const docId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      href={`/document/${docId}`}
      className="flex flex-col hover:opacity-80 transition-opacity"
    >
      <div
        className={`aspect-[4/3] rounded border flex items-center justify-center overflow-hidden ${className}`}
      >
        {image ? (
          <Image
            height={200}
            width={200}
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          icon
        )}
      </div>
      <div className="mt-1 text-sm text-center">{title}</div>
    </Link>
  );
}
