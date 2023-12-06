"use client";
import React from "react";
import { converterTimeStamp, getUserNameById } from "@/helpers/function";
import { useMessages, useRooms, useUsers } from "@/states/GlobalStates";
import { supabase } from "@/supabase/client";
import { messagesT } from "@/typescript/types";
import { toast } from "react-toastify";
import _ from "lodash";

function Messages() {
  const { currentRoom } = useRooms((state) => state);
  const { currentRoomMessages, getCurrentRoomMessages } = useMessages(
    (state) => state
  );
  const { currentUser, allUsers } = useUsers((state) => state);
  const chatBodyRef = React.useRef<HTMLDivElement>(null);

  const scrollOnMessage = () => {
    if (chatBodyRef.current) {
      const height = chatBodyRef.current.scrollHeight;
      chatBodyRef.current.scrollTop = height;
    }
  };

  React.useLayoutEffect(() => {
    scrollOnMessage();
  }, [currentRoom, currentRoomMessages]);

  supabase
    .channel("messagesChannel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      () => {
        if (currentRoom.id) {
          supabase
            .from("messages")
            .select()
            .eq("room_id", currentRoom.id)
            .order("created_at", { ascending: true })
            .returns<messagesT[]>()
            .then(({ data, error }) => {
              if (error) {
                toast.error(error.message);
                return;
              }
              getCurrentRoomMessages(data);
              scrollOnMessage();
            });
        }
      }
    )
    .subscribe();

  return (
    <section
      className={`h-full overflow-auto relative pb-10`}
      ref={chatBodyRef}
    >
      {_.isEmpty(currentRoom) ? (
        <div className="h-full grid place-content-center text-center text-xl">
          <h2>Bem-vindo!</h2>
          <p>Escolha uma sala e comece a conversar.</p>
        </div>
      ) : (
        <>
          <ul>
            {currentRoomMessages.length > 0 &&
              currentRoomMessages.map((message) => (
                <li
                  key={JSON.stringify(message.created_at)}
                  className={`flex flex-col px-2 py-1 rounded-md mb-2 lg:w-2/3 lg:max-w-lg ${
                    message.user_id == currentUser.id
                      ? "bg-blue-900 ml-auto"
                      : "bg-red-900"
                  }`}
                >
                  <span className={`text-sm font-bold`}>
                    {message.user_id == currentUser.id
                      ? "Você"
                      : getUserNameById(message.user_id, allUsers)}
                  </span>
                  <span className="text-justify">{message.message}</span>
                  <span className="text-xs text-right">
                    {converterTimeStamp(message.created_at)}
                  </span>
                </li>
              ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default Messages;
