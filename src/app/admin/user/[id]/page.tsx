"use client";
import React from "react";
import { useParams } from "next/navigation";
import { converterTimeStamp } from "@/helpers/function";
import { adminAuthClient } from "@/supabase/admin";
import { messagesT } from "@/typescript/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/supabase/client";
import _ from "lodash";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import EditUser from "@/components/admin/EditUser";
import { toast } from "react-toastify";

function User() {
  const { id }: { id: string } = useParams();
  const [user, setUser] = React.useState<User | null>();
  const [userMessages, setUserMessages] = React.useState<messagesT[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    adminAuthClient.getUserById(id).then(({ data: { user }, error }) => {
      if (error) {
        console.log(error.message);
        toast.error("Algo deu errado");
        return;
      }
      setUser(user);
    });

    supabase
      .from("messages")
      .select()
      .eq("user_id", id)
      .then(({ data, error }) => {
        if (!error) {
          setUserMessages(data);
        } else {
          console.log(error.message);
          toast.error("Algo deu errado");
        }
      });

    setLoading(false);
  }, []);

  if (loading)
    return (
      <main className="container mt-5">
        <AiOutlineLoading3Quarters
          size="2em"
          className="animate-spin mx-auto"
        />
      </main>
    );

  return (
    <main className="container mt-2">
      {user && (
        <ul className="pb-10">
          <li>
            <span className="font-semibold">Nome: </span>
            {user.user_metadata.name}
          </li>
          <li>
            <span className="font-semibold">Email: </span>
            {user.email}
          </li>
          <li>
            <span className="font-semibold">Função: </span>
            {user.user_metadata.role || "usuário"}
          </li>
          <li>
            <span className="font-semibold">Último login: </span>
            {converterTimeStamp(user.last_sign_in_at)}
          </li>
          <li>
            <span className="font-semibold"> Data de criação da conta: </span>
            {converterTimeStamp(user.created_at)}
          </li>
          <li>
            <span className="font-semibold">Total de mensagens enviadas: </span>
            {userMessages.length}
          </li>
        </ul>
      )}

      <EditUser />
    </main>
  );
}

export default User;
