import React from "react";
import { supabase } from "@/supabase/client";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { useUsers } from "@/states/GlobalStates";

function DeleteRoom({
  id,
  setDeleteRoom,
}: {
  id: string;
  setDeleteRoom: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [error, setError] = React.useState("");
  const { allUsers } = useUsers((state) => state);

  function cancelDelete(event: any) {
    if (event.target.dataset.close) {
      setDeleteRoom(false);
    }
  }

  async function deleteRoom() {
    const usersInThisRoom = allUsers.filter((user) => user.public_room == id);
    if (usersInThisRoom.length > 0) {
      toast.error("Você não pode excluir esta sala com usuários nela");
      setDeleteRoom(false);
      return;
    } else {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) {
        setError(error.message);
        return;
      }
      toast.success("Sala deletada com sucesso!");
      setDeleteRoom(false);
    }
  }

  return (
    <section
      className="fixed bg-white bg-opacity-50 h-full w-full inset-0 grid place-items-center"
      data-close={true}
      onClick={cancelDelete}
    >
      <div className="bg-white p-4 rounded-md mx-4 border shadow-md shadow-black">
        <BsFillExclamationTriangleFill
          className="text-red-600 mx-auto mb-2"
          size="2em"
        />
        <h2 className="text-black text-lg">
          Tem certeza que quer deletar esta sala?
          <br />
          Todas as mensagens serão excluídas.
        </h2>
        <button
          className="p-2 w-full rounded-md mt-3 bg-red-600 hover:bg-red-700 shadow-md shadow-black"
          onClick={deleteRoom}
        >
          Deletar
        </button>
        <span className="text-red-500 text-sm">{error}</span>
        <button
          className="p-2 w-full rounded-md mt-3 bg-green-500 hover:bg-green-600 shadow-md shadow-black"
          data-close={true}
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}

export default DeleteRoom;
