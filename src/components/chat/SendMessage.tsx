"use client";
import React from "react";
import { IoSendSharp } from "react-icons/io5";
import { useRooms, useUsers } from "@/states/GlobalStates";
import { supabase } from "@/supabase/client";
import { toast } from "react-toastify";
import _ from "lodash";

function SendMessage() {
  const [message, setMessage] = React.useState("");
  const { currentRoom } = useRooms((state) => state);
  const { currentUser } = useUsers((state) => state);

  async function sendMessage(event: any) {
    event.preventDefault();

    if (message.trim() != "") {
      const { error } = await supabase.from("messages").insert({
        user_id: currentUser.id,
        room_id: currentRoom.id,
        message,
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      setMessage("");
    }
  }

  if (_.isEmpty(currentRoom)) return <></>;

  return (
    <form
      className="flex items-center border rounded-md absolute bottom-0 left-0 right-0 p-2 z-10 bg-zinc-900 mx-4 my-2"
      onSubmit={sendMessage}
    >
      <input
        className="p-1 rounded-md flex-1 text-black"
        value={message}
        onChange={({ target }) => setMessage(target.value)}
      />
      <button type="submit">
        <IoSendSharp className="text-white ml-2 text-2xl" />
      </button>
    </form>
  );
}

export default SendMessage;
