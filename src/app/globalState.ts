import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import type { IUser } from "../utils/interfaces/IUser";

interface UserState {
  user?: Omit<IUser, "password"> | null;
  isLoaded: boolean;
  setUser: (user: Omit<IUser, "password"> | null, isLoaded?: boolean) => void;
}

export const useUserState = create<UserState>()(
  devtools((set) => ({
    user: null,
    isLoaded: false,
    setUser: (user, isLoaded = true) => {
      set({ user, isLoaded });
    },
  }))
);
