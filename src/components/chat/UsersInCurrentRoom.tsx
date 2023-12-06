"use client";
import { useUsers, useRooms, useMobileMenu } from "@/states/GlobalStates";
import React, { ChangeEvent } from "react";
import { DebounceInput } from "react-debounce-input";
import { userT } from "@/typescript/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import _ from "lodash";

function UsersInCurentRoom() {
  const { currentRoom, usersOnCurrentRoom, getUsersOnCurrentRoom } = useRooms(
    (state) => state
  );
  const { currentUser, allUsers } = useUsers((state) => state);
  const { showMobile } = useMobileMenu((state) => state);
  const [renderUsersData, setRenderUsersData] = React.useState<userT[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const usersInCurrentRoom = allUsers.filter(
      (user) => user.public_room && user.public_room == currentRoom.id
    );

    setRenderUsersData(usersInCurrentRoom);
    getUsersOnCurrentRoom(usersInCurrentRoom);
    setLoading(false);
  }, [allUsers]);

  function searchUser(event: ChangeEvent<HTMLInputElement>) {
    const filteredData = usersOnCurrentRoom.filter((user) =>
      user.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setRenderUsersData(filteredData);
  }

  return (
    <section
      className={`sm:w-60  px-2 rounded-md bg-white overflow-hidden h-full ${
        showMobile !== "users" ? "hidden" : "w-full"
      }`}
      key={showMobile}
    >
      <div className="h-24">
        <p className="uppercase p-2 text-black flex justify-between items-center">
          Usuários
        </p>
        <div className="flex bg-zinc-200 text-black items-center rounded-md">
          <DebounceInput
            minLength={1}
            debounceTimeout={500}
            onChange={searchUser}
            className="w-full rounded-md p-2 bg-inherit"
            placeholder="Buscar usuário"
          />
        </div>
      </div>

      <>
        {loading ? (
          <AiOutlineLoading3Quarters
            size="1.5em"
            className="animate-spin text-black mx-auto"
          />
        ) : (
          <>
            {renderUsersData.length > 0 ? (
              renderUsersData.map(({ name, id }) => (
                <span
                  key={id}
                  className="w-full block rounded-md mb-1 px-2 py-1 border bg-zinc-900 "
                >
                  {currentUser.name == name ? "Você" : name}
                </span>
              ))
            ) : (
              <p className="text-black">Nenhum usuásio encontrado</p>
            )}
          </>
        )}
      </>
    </section>
  );
}

export default UsersInCurentRoom;
