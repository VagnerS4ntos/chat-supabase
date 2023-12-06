"use client";
import React from "react";
import ChatRooms from "@/components/chat/ChatRooms";
import Chat from "@/components/chat/Chat";
import UsersInCurentRoom from "@/components/chat/UsersInCurrentRoom";
import {
  useMessages,
  useMobileMenu,
  useRooms,
  useUsers,
} from "@/states/GlobalStates";
import { supabase } from "@/supabase/client";
import { roomT } from "@/typescript/types";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import _ from "lodash";

export default function Page() {
  const { currentRoom, getCurrentRoom } = useRooms((state) => state);
  const { getCurrentRoomMessages } = useMessages((state) => state);
  const { currentUser } = useUsers((state) => state);
  const { setShowMobile, showMobile } = useMobileMenu((state) => state);

  async function leaveRoom() {
    if (!_.isEmpty(currentRoom)) {
      const { error } = await supabase
        .from("users")
        .update({ public_room: null })
        .eq("id", currentUser.id);

      if (!error) {
        getCurrentRoom({} as roomT);
        getCurrentRoomMessages([]);
        setShowMobile("rooms");
      }
    }
  }

  return (
    <main className="container container_height">
      <div className="font-bold uppercase rounded-md text-black flex items-center px-2 gap-4 h-10 bg-white mt-4">
        <span className="text-orange-600">{currentRoom.name}</span>

        {!_.isEmpty(currentRoom) && (
          <span
            className={`cursor-pointer hover:text-orange-600 ${
              showMobile == "users" && "text-orange-600"
            }`}
            onClick={() => setShowMobile("users")}
          >
            <FaUsers size="1.5em" />
          </span>
        )}

        <span
          className={`cursor-pointer hover:text-orange-600 ${
            showMobile == "rooms" && "text-orange-600"
          }`}
          onClick={() => setShowMobile("rooms")}
        >
          <MdOutlineFormatListBulleted size="1.6em" />
        </span>

        {!_.isEmpty(currentRoom) && (
          <>
            <span
              className={`cursor-pointer hover:text-orange-600 sm:hidden ${
                showMobile == "chat" && "text-orange-600"
              }`}
              onClick={() => setShowMobile("chat")}
            >
              <IoChatboxEllipsesOutline size="1.6em" />
            </span>
            <span
              className="bg-red-600 text-white text-md rounded-full w-6 h-6 grid place-items-center cursor-pointer ml-auto"
              title="Sair"
              onClick={leaveRoom}
            >
              X
            </span>
          </>
        )}
      </div>

      <section className="flex gap-4 py-4 h-full">
        <ChatRooms />
        <UsersInCurentRoom />
        <Chat />
      </section>
    </main>
  );
}
