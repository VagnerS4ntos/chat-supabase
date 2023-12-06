import { z } from "zod";

/**********USER PUBLIC DATABASE**********/

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  public_room: z.string(),
  email: z.string(),
});
export type userT = z.infer<typeof userSchema>;

/**********USER DATABASE ZUSTAND STORE**********/
const storeUserSchema = z.object({
  currentUser: userSchema,
  getCurrentUser: z.function().args(userSchema),
  allUsers: z.array(userSchema),
  getAllUsers: z.function().args(z.array(userSchema)),
});
export type storeUsersT = z.infer<typeof storeUserSchema>;

/**********ROOM DATABASE**********/
const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  private_room: z.boolean(),
});

export type roomT = z.infer<typeof roomSchema>;

/**********ROOM ZUSTAND STORE**********/
const storeRoomsSchema = z.object({
  currentRoom: roomSchema,
  getCurrentRoom: z.function().args(roomSchema),
  allRooms: z.array(roomSchema),
  getAllRooms: z.function().args(z.array(roomSchema)),
  usersOnCurrentRoom: z.array(userSchema),
  getUsersOnCurrentRoom: z.function().args(z.array(userSchema)),
});

export type storeRoomsT = z.infer<typeof storeRoomsSchema>;

/**********MESSAGES DATABASE**********/
const messagesSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime(),
  message: z.string(),
  room_id: z.string(),
});
export type messagesT = z.infer<typeof messagesSchema>;

/**********MESSAGES ZUSTAND STORE**********/
const storeMessagesSchema = z.object({
  currentRoomMessages: z.array(messagesSchema),
  getCurrentRoomMessages: z.function().args(z.array(messagesSchema)),
});

export type storeMessagesT = z.infer<typeof storeMessagesSchema>;

/**********MENU ZUSTAND STORE**********/
const storeMobileSchema = z.object({
  showMobile: z.enum(["users", "rooms", "chat"]),
  setShowMobile: z.function().args(z.enum(["users", "rooms", "chat"])),
});

export type storeMobileSchemaT = z.infer<typeof storeMobileSchema>;
