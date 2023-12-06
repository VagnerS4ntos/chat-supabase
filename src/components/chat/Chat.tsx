"use client";
import React from "react";
import SendMessage from "./SendMessage";
import Messages from "./Messages";
import { useMobileMenu } from "@/states/GlobalStates";

function Chat() {
  const { showMobile } = useMobileMenu((state) => state);

  return (
    <section
      className={`bg-zinc-900 p-4 rounded-md grow-1 w-full overflow-auto h-full relative sm:block ${
        showMobile !== "chat" ? "hidden" : "w-full"
      }`}
    >
      <Messages />
      <SendMessage />
    </section>
  );
}

export default Chat;
