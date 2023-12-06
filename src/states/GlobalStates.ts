import { create } from "zustand";
import {
  storeRoomsT,
  storeUsersT,
  roomT,
  userT,
  storeMessagesT,
  storeMobileSchemaT,
} from "@/typescript/types";

export const useUsers = create<storeUsersT>((set) => ({
  currentUser: {} as userT,
  getCurrentUser: (data) => set(() => ({ currentUser: data })),
  allUsers: [],
  getAllUsers: (data) => set(() => ({ allUsers: data })),
}));

export const useRooms = create<storeRoomsT>((set) => ({
  currentRoom: {} as roomT,
  getCurrentRoom: (data) => set(() => ({ currentRoom: data })),
  allRooms: [],
  getAllRooms: (data) => set(() => ({ allRooms: data })),
  usersOnCurrentRoom: [],
  getUsersOnCurrentRoom: (data) => set(() => ({ usersOnCurrentRoom: data })),
}));

export const useMessages = create<storeMessagesT>((set) => ({
  currentRoomMessages: [],
  getCurrentRoomMessages: (data) => set(() => ({ currentRoomMessages: data })),
}));

export const useMobileMenu = create<storeMobileSchemaT>((set) => ({
  showMobile: "rooms",
  setShowMobile: (data) => set(() => ({ showMobile: data })),
}));
