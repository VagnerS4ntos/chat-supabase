import { useRooms } from '@/states/GlobalStates';
import React from 'react';
import Paginate from '../Paginate';
import { roomT } from '@/typescript/types';
import DeleteRoom from './DeleteRoom';
import ShowRoomUsers from './ShowRoomUsers';
import LockRoom from './LockRoom';
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import SearchRoom from './SearchRoom';
import UpdateRoomName from './UpdateRoomName';

function EditRooms() {
	const { allRooms } = useRooms((state) => state);

	//Paginação
	const [filteredData, setFilteredData] = React.useState<roomT[]>([]);
	const [currentPage, setCurrentPage] = React.useState(1);
	const roomsPerPage = 10;
	const lastRoomIndex = currentPage * roomsPerPage;
	const firstRoomIndex = lastRoomIndex - roomsPerPage;
	const [slicedRooms, setSlicedRooms] = React.useState<roomT[]>([]);

	React.useEffect(() => {
		setFilteredData(allRooms);
		const slicedRooms = allRooms.slice(firstRoomIndex, lastRoomIndex);
		setSlicedRooms(slicedRooms);
		if (slicedRooms.length % 10 == 0 && currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	}, [allRooms, currentPage]);

	//Abre a janela para deletar a sala
	const [deleteRoomID, setDeleteRoomID] = React.useState('');
	const [deleteRoom, setDeleteRoom] = React.useState(false);

	function requestDeleteRoom(event: any) {
		const { id } = event.target.closest('[data-id]').dataset;
		setDeleteRoomID(id);
		setDeleteRoom(true);
	}

	//Abre a janela para ver os usuários na sala
	const [showUsers, setShowUsers] = React.useState(false);
	const [showUsersRoomID, setShowUsersROOMID] = React.useState('');

	function requestShowUsersRoom(event: any) {
		const { id } = event.target.closest('[data-id]').dataset;
		setShowUsersROOMID(id);
		setShowUsers(true);
	}

	return (
		<div className="mt-10 h-full pb-10">
			<h1 className="text-xl uppercase mb-2">Editar sala</h1>
			<SearchRoom
				setFilteredData={setFilteredData}
				setSlicedRooms={setSlicedRooms}
				firstRoomIndex={firstRoomIndex}
				lastRoomIndex={lastRoomIndex}
			/>

			{filteredData.length == 0 ? (
				<h1 className="mt-2">Nenhuma sala encontrada</h1>
			) : (
				<div className="overflow-scroll">
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
										<UpdateRoomName currentName={room.name} />
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
										<LockRoom id={room.id} isPrivate={room.private_room} />
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{filteredData.length > roomsPerPage && (
						<Paginate
							dataLength={filteredData.length}
							dataPerPage={roomsPerPage}
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
		</div>
	);
}

export default EditRooms;
