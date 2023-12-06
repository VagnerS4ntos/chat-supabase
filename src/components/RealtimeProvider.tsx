"use client";
import React from "react";
import { supabase } from "@/supabase/client";
import { useMobileMenu, useRooms, useUsers } from "@/states/GlobalStates";
import { roomT, userT } from "@/typescript/types";
import { useRouter } from "next/navigation";
import _ from "lodash";

function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { getAllUsers, currentUser } = useUsers((state) => state);
  const { setShowMobile } = useMobileMenu((state) => state);
  const { getCurrentRoom, getAllRooms } = useRooms((state) => state);

  React.useEffect(() => {
    supabase
      .from("users")
      .select()
      .returns<userT[]>()
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (!error) {
          getAllUsers(data);
        } else {
          console.log(error.message);
        }
      });

    supabase
      .from("rooms")
      .select()
      .returns<roomT[]>()
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error) {
          getAllRooms(data);
        } else {
          console.log(error.message);
        }
      });
  }, []);

  React.useEffect(() => {
    const databaseChannel = supabase
      .channel("databaseChannel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => {
          if (payload.table == "rooms") {
            supabase
              .from("rooms")
              .select()
              .returns<roomT[]>()
              .order("created_at", { ascending: true })
              .then(({ data, error }) => {
                if (!error) {
                  getAllRooms(data);
                } else {
                  console.log(error.message);
                }
              });
          }

          if (payload.table == "users") {
            supabase
              .from("users")
              .select()
              .returns<userT[]>()
              .then(({ data, error }) => {
                if (!error) {
                  router.refresh();
                  getAllUsers(data);
                } else {
                  console.log(error.message);
                }
              });

            if (
              payload.eventType == "UPDATE" &&
              payload.new.public_room == null &&
              payload.new.id == currentUser.id
            ) {
              getCurrentRoom({} as roomT);
              setShowMobile("rooms");
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(databaseChannel);
    };
    //Coloquei currentUser como dependência porque ele não estava chegando dentro do código
  }, [currentUser]);

  return <>{children}</>;
}

export default RealtimeProvider;
