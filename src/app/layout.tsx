import "./globals.css";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { Metadata } from "next";
import React from "react";
import { headers } from "next/headers";
import { ToastContainer } from "react-toastify";
import RealtimeProvider from "@/components/RealtimeProvider";

export const metadata: Metadata = {
  title: "Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const user = headersList.get("user");

  return (
    <html lang="pt-br">
      <body
        className="flex flex-col h-screen min-h-screen"
        suppressHydrationWarning={true}
      >
        <RealtimeProvider>
          {user && <Header userAuth={user} />}
          {children}
          <ToastContainer />
        </RealtimeProvider>
      </body>
    </html>
  );
}
