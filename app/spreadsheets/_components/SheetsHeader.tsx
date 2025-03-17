import { useUserStore } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVeltClient } from "@veltdev/react";
import Link from "next/link";
import React, { Ref, useEffect } from "react";

interface SheetsHeaderProps {
  measureRef: Ref<HTMLSpanElement> | undefined;
  filename: string;
  inputRef: Ref<HTMLInputElement> | undefined;
  setFilename: (value: string) => void;
  handleTitleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const SheetsHeader: React.FC<SheetsHeaderProps> = ({
  measureRef,
  filename,
  inputRef,
  setFilename,
  handleTitleFocus,
}) => {
  const { user, login, logout } = useUserStore();

  const { client } = useVeltClient();
  const loginDummyUser = () => {
    const dummyUser = {
      uid: "12345",
      displayName: "John Doe",
      email: "john.doe@example.com",
      photoURL:
        "https://robohash.org/cef02e24fe3282152a3f4b57eb0de839?set=set2&bgset=bg1&size=400x400",
      organizationId: "org-123",
      colorCode: "#3b82f6",
      textColor: "#ffffff",
    };
    login(dummyUser);
  };

  const logoutDummyUser = () => {
    logout();
  };

  useEffect(() => {
    if (client && user) {
      const veltUser = {
        userId: user.uid,
        organizationId: user.organizationId,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        color: user.colorCode,
        textColor: user.textColor,
      };

      client.identify(veltUser);
    }
  }, [client, user]);
  return (
    <div className="flex items-center justify-between p-2 border-b bg-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-5 h-5"
              >
                <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
              </svg>
            </div>
            <span className="text-lg font-medium">Sheets</span>
          </Link>
          <div className="relative">
            <span
              ref={measureRef}
              className="invisible absolute whitespace-pre"
              style={{ fontWeight: 500, fontSize: "1.125rem" }}
            >
              {filename}
            </span>
            <Input
              ref={inputRef}
              value={filename}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setFilename(e.target.value)
              }
              onFocus={handleTitleFocus}
              className="text-lg font-medium h-9 focus-visible:ring-1 px-2 py-1"
              style={{
                width: `${
                  Math.max(
                    (measureRef as React.RefObject<HTMLSpanElement>)?.current
                      ?.offsetWidth ?? 0,
                    120
                  ) + 24
                }px`,
                minWidth: "20px",
                maxWidth: "400px",
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4 gap-4">
        {user ? (
          <Button
            variant="ghost"
            onClick={logoutDummyUser}
            className="text-gray-600 hover:bg-gray-100"
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={loginDummyUser}
            className="text-gray-600 hover:bg-gray-100"
          >
            Login
          </Button>
        )}

        <Button
          variant="ghost"
          className="p-0 h-9 w-9 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-200"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={user?.photoURL || "https://example.com/avatar.jpg"}
              alt="User"
            />
            <AvatarFallback className="bg-blue-200 text-blue-800">
              {user?.displayName[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </div>
  );
};

export default SheetsHeader;
