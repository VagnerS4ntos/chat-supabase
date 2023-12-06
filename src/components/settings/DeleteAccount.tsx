"use client";
import React, { MouseEventHandler } from "react";
import { adminAuthClient } from "@/supabase/admin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { useMessages, useRooms, useUsers } from "@/states/GlobalStates";
import { roomT } from "@/typescript/types";

function DeleteAccount({ id }: { id?: string }) {
  const router = useRouter();
  const [deleteAcc, setDeleteAcc] = React.useState(false);
  const { currentUser } = useUsers((state) => state);
  const { getCurrentRoom } = useRooms((state) => state);
  const { getCurrentRoomMessages } = useMessages((state) => state);
  const [customError, setCustomError] = React.useState("");

  const handleClose: MouseEventHandler<HTMLElement> = (event) => {
    const target = event.target as HTMLElement;
    if (target.dataset.close) {
      setCustomError("");
      setDeleteAcc(false);
    }
  };

  async function deleteAccount() {
    const user_id = id || currentUser.id;
    const { error } = await adminAuthClient.deleteUser(user_id);

    if (error) {
      setCustomError(error.message);
      return;
    }

    toast.success("Usuário deletado com sucesso");
    if (id) {
      router.push("/admin");
      return;
    }
    getCurrentRoom({} as roomT);
    getCurrentRoomMessages([]);
    router.refresh();
  }

  return (
    <section className="max-w-sm mx-auto mt-5" onClick={handleClose}>
      <button
        className="p-2 w-full rounded-md mt-3 bg-orange-500 hover:bg-orange-600"
        onClick={() => setDeleteAcc(true)}
      >
        Deletar conta
      </button>

      {deleteAcc && (
        <div
          className="bg-white bg-opacity-50 fixed inset-0 grid place-items-center"
          data-close={true}
        >
          <div className="bg-white p-4 rounded-md shadow-md shadow-black">
            <BsFillExclamationTriangleFill
              className="text-red-600 mx-auto mb-2"
              size="2em"
            />
            <h2 className="text-black text-lg">
              Tem certeza que quer deletar sua conta?
            </h2>
            <button
              className="p-2 w-full rounded-md mt-3 bg-red-600 hover:bg-red-700 shadow-md shadow-black"
              onClick={deleteAccount}
            >
              Deletar
            </button>
            <span className="text-red-500 text-sm">{customError}</span>
            <button
              className="p-2 w-full rounded-md mt-3 bg-green-500 hover:bg-green-600 shadow-md shadow-black"
              data-close={true}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DeleteAccount;
