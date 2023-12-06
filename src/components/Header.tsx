"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import {
  useMessages,
  useMobileMenu,
  useRooms,
  useUsers,
} from "@/states/GlobalStates";
import { roomT, userT } from "@/typescript/types";
import { RiAdminFill } from "react-icons/ri";
import { VscSignOut } from "react-icons/vsc";
import { AiFillSetting } from "react-icons/ai";
import { toast } from "react-toastify";
import { User } from "@supabase/supabase-js";

function Header({ userAuth }: { userAuth: string | null }) {
  const router = useRouter();
  const { getCurrentUser, currentUser } = useUsers((state) => state);
  const { getCurrentRoom, getAllRooms } = useRooms((state) => state);
  const { getCurrentRoomMessages } = useMessages((state) => state);
  const { setShowMobile } = useMobileMenu((state) => state);

  async function logOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      const { error } = await supabase
        .from("users")
        .update({ public_room: null })
        .eq("id", currentUser.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      getCurrentRoom({} as roomT);
      getCurrentRoomMessages([]);
      router.refresh();
      router.push("/login");
    } else {
      toast.error(error.message);
    }
  }

  async function RemoveUserFromCurrentRoom(id: string) {
    const { error } = await supabase
      .from("users")
      .update({ public_room: null })
      .eq("id", id);

    if (!error) {
      getCurrentRoom({} as roomT);
      getCurrentRoomMessages([]);
      setShowMobile("rooms");
    }
  }

  React.useEffect(() => {
    if (userAuth) {
      const user = JSON.parse(userAuth) as User;

      supabase
        .from("users")
        .select()
        .order("name", { ascending: true })
        .eq("id", user.id)
        .returns<userT[]>()
        .then(({ data, error }) => {
          if (!error) {
            getCurrentUser(data[0]);

            if (data[0].public_room) {
              //Desloga o usuário da sala sempre que recarregar a página e o usuário estiver em uma sala
              RemoveUserFromCurrentRoom(user.id);
            }
          } else {
            toast.error(error.message);
          }
        });
    }

    supabase
      .from("rooms")
      .select()
      .returns<roomT[]>()
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast.error(error.message);
          return;
        }
        getAllRooms(data);
      });
  }, []);

  return (
    <header className="py-4 h-24 bg-green-400">
      <nav className="container flex items-center justify-between text-black">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src={logo} alt="logo" width="75" height="75" priority />
          </Link>
          <p className="font-semibold">
            Bem-vindo, {userAuth && JSON.parse(userAuth).user_metadata.name}
          </p>
        </div>

        <ul className="flex items-center gap-2 ml-2">
          <li className="cursor-pointer">
            <Link href="/settings">
              <AiFillSetting size="1.6em" className="hover:text-white" />
            </Link>
          </li>
          {userAuth && JSON.parse(userAuth).user_metadata.role == "admin" && (
            <li>
              <Link href="/admin">
                <RiAdminFill size="1.6em" className="hover:text-white" />
              </Link>
            </li>
          )}

          <li onClick={logOut} className="cursor-pointer">
            <VscSignOut size="1.6em" className="hover:text-white" />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
