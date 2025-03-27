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
  availableUsers: User[];
  login: (user: User) => void;
  logout: () => void;
}

const staticUsers: User[] = [
  {
    uid: "user001",
    displayName: "Alice",
    email: "alice@example.com",
    photoURL: "https://picsum.photos/seed/user001/200/300",
    organizationId: "org-user001",
    colorCode: "#4CAF50",
    textColor: "#ffffff",
  },
  {
    uid: "user002",
    displayName: "Bob",
    email: "bob@example.com",
    photoURL: "https://picsum.photos/seed/user002/200/300",
    organizationId: "org-user002",
    colorCode: "#2196F3",
    textColor: "#ffffff",
  },
];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      availableUsers: staticUsers,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
