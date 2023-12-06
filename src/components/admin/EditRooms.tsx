import { useRooms } from '@/states/GlobalStates';
import React, { ChangeEvent } from 'react';
import Paginate from '../Paginate';
import { DebounceInput } from 'react-debounce-input';
import { roomT } from '@/typescript/types';
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import DeleteRoom from './DeleteRoom';
import ShowRoomUsers from './ShowRoomUsers';
import { toast } from 'react-toastify';
import { supabase } from '@/supabase/client';

function EditRooms() {
	const { allRooms } = useRooms((state) => state);

	//Paginação
	const [filteredData, setFilteredData] = React.useState<roomT[]>([]);
	const [currentPage, setCurrentPage] = React.useState(1);
	const roomsPerPege = 10;
	const lastRoomIndex = currentPage * roomsPerPege;
	const firstRoomIndex = lastRoomIndex - roomsPerPege;
	const [slicedRooms, setSlicedRooms] = React.useState<roomT[]>([]);

	React.useEffect(() => {
		setFilteredData(allRooms);
		const slicedRooms = allRooms.slice(firstRoomIndex, lastRoomIndex);
		setSlicedRooms(slicedRooms);
		if (slicedRooms.length % 10 == 0 && currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	}, [allRooms, currentPage]);

	//Procurar sala
	function searchRoom(event: ChangeEvent<HTMLInputElement>) {
		const filteredData = allRooms.filter((room) =>
			room.name.toLowerCase().includes(event.target.value.toLowerCase()),
		);
		setFilteredData(filteredData);
		const slicedRooms = filteredData.slice(firstRoomIndex, lastRoomIndex);
		setSlicedRooms(slicedRooms);
	}

	//Atualizar nome da sala
	const [newName, setNewName] = React.useState('');

	async function updateRoomName(event: any) {
		event.preventDefault();
		const { id } = event.target.closest('[data-id]').dataset;

		const nameExists = allRooms.some(
			(room) => room.name.toLowerCase() === newName.toLowerCase(),
		);
		if (nameExists || newName.length < 3) {
			toast.error('Esta sala já existe ou o nome é muito curto');
			return;
		}
		const { error } = await supabase
			.from('rooms')
			.update({ name: newName.trim() })
			.eq('id', id);

		if (error) {
			toast.error('Algo deu errado');
			console.log(error.message);
			return;
		}

		toast.success('Nome atualizado com sucesso!');
	}

	//Deletar sala
	const [deleteRoomID, setDeleteRoomID] = React.useState('');
	const [deleteRoom, setDeleteRoom] = React.useState(false);

	function requestDeleteRoom(event: any) {
		const { id } = event.target.closest('[data-id]').dataset;
		setDeleteRoomID(id);
		setDeleteRoom(true);
	}

	//Usuários na sala
	const [showUsers, setShowUsers] = React.useState(false);
	const [showUsersRoomID, setShowUsersROOMID] = React.useState('');

	function requestShowUsersRoom(event: any) {
		const { id } = event.target.closest('[data-id]').dataset;
		setShowUsersROOMID(id);
		setShowUsers(true);
	}

	//Bloquear/desbloquear sala
	async function handleLockRoom(event: any) {
		const { id } = event.target.closest('[data-id]').dataset;
		const room = allRooms.filter((room) => room.id == id)[0];
		if (room.private_room) {
			const { error } = await supabase
				.from('rooms')
				.update({ private_room: false })
				.eq('id', id);

			if (error) {
				toast.error(error.message);
			}
		} else {
			const { error } = await supabase
				.from('rooms')
				.update({ private_room: true })
				.eq('id', id);

			if (error) {
				toast.error(error.message);
			}
		}
	}

	return (
		<section className="mt-10 h-full pb-10">
			<h1 className="text-xl uppercase mb-2">Editar sala</h1>
			<label htmlFor="searchRoom">Buscar sala</label>
			<DebounceInput
				minLength={1}
				debounceTimeout={500}
				onChange={searchRoom}
				className="w-full rounded-md p-2 mt-1 text-black outline-none bg-white"
				placeholder="Buscar sala"
				id="searchRoom"
			/>
			{filteredData.length == 0 ? (
				<h1 className="mt-2">Nenhuma sala encontrada</h1>
			) : (
				<div className="overflow-x-auto">
					<table className="border table-auto w-full mt-2">
						<thead>
							<tr className="bg-white text-black uppercase text-sm">
								<th className={`px-4 py-2`}>Nome</th>
								<th className={`px-4 py-2`}>Excluir</th>
								<th className={`px-4 py-2`}>Usuários</th>
								<th className={`px-4 py-2`}>Bloqueio</th>
							</tr>
						</thead>
						<tbody className="text-white">
							{slicedRooms.map((room) => (
								<tr key={room.id} className={`border`} data-id={room.id}>
									<td className={`px-4 py-2 text-center border`}>
										<form onSubmit={updateRoomName}>
											<input
												type="text"
												defaultValue={room.name}
												className="text-center bg-zinc-900 text-white border"
												onChange={({ target }) =>
													setNewName(target.value.trim())
												}
											/>
											<button className="bg-zinc-900 hover:bg-zinc-700 border px-2">
												Atualizar
											</button>
										</form>
									</td>
									<td className={`px-4 py-2 border`}>
										<AiFillDelete
											size="1.5em"
											className="cursor-pointer mx-auto hover:text-red-500"
											onClick={requestDeleteRoom}
										/>
									</td>
									<td className={`px-4 py-2 border`}>
										<AiFillEye
											size="1.5em"
											className="cursor-pointer mx-auto hover:text-blue-500"
											onClick={requestShowUsersRoom}
										/>
									</td>
									<td className={`px-4 py-2 border`}>
										{room.private_room ? (
											<FaLock
												size="1.5em"
												className="cursor-pointer mx-auto text-red-600 hover:text-yellow-500"
												onClick={handleLockRoom}
											/>
										) : (
											<FaLockOpen
												size="1.5em"
												className="cursor-pointer mx-auto text-yellow-500 hover:text-red-600"
												onClick={handleLockRoom}
											/>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{filteredData.length > roomsPerPege && (
						<Paginate
							dataLength={filteredData.length}
							dataPerPage={roomsPerPege}
							setCurrentPage={setCurrentPage}
						/>
					)}
				</div>
			)}

			{deleteRoom && (
				<DeleteRoom id={deleteRoomID} setDeleteRoom={setDeleteRoom} />
			)}

			{showUsers && (
				<ShowRoomUsers id={showUsersRoomID} setShowUsers={setShowUsers} />
			)}
		</section>
	);
}

export default EditRooms;
