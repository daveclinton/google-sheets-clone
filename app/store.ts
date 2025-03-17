import { create } from "zustand";

type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  organizationId: string;
  colorCode: string;
  textColor: string;
};

type UserStore = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: {
    uid: "12345",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL:
      "https://robohash.org/cef02e24fe3282152a3f4b57eb0de839?set=set2&bgset=bg1&size=400x400",
    organizationId: "org-123",
    colorCode: "#3b82f6",
    textColor: "#ffffff",
  },
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
