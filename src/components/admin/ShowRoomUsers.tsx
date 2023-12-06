import React from 'react';
import { useUsers } from '@/states/GlobalStates';
import { userT } from '@/typescript/types';
import { MdRemoveCircle } from 'react-icons/md';
import { supabase } from '@/supabase/client';
import Paginate from '../Paginate';
import { toast } from 'react-toastify';

function ShowRoomUsers({
	id,
	setShowUsers,
}: {
	id: string;
	setShowUsers: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [users, setUsers] = React.useState<userT[]>([]);
	const { allUsers, currentUser } = useUsers((state) => state);

	const [currentPage, setCurrentPage] = React.useState(1);
	const usersPerPege = 10;
	const lastUserIndex = currentPage * usersPerPege;
	const firstUserIndex = lastUserIndex - usersPerPege;
	const [slicedUsers, setSlicedUsers] = React.useState<userT[]>([]);

	React.useEffect(() => {
		const roomUsers = allUsers.filter((user) => user.public_room == id);
		setUsers(roomUsers);

		const slicedUsers = roomUsers.slice(firstUserIndex, lastUserIndex);
		setSlicedUsers(slicedUsers);

		if (slicedUsers.length % 10 == 0 && currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	}, [allUsers]);

	function cancelShowUsers(event: any) {
		if (event.target.dataset.close) {
			setShowUsers(false);
		}
	}

	async function removeUser(event: any) {
		const { id } = event.target.closest('[data-id]').dataset;
		const { error } = await supabase
			.from('users')
			.update({ public_room: null })
			.eq('id', id);

		if (users.length == 1) {
			setShowUsers(false);
		}

		if (error) {
			console.log(error.message);
			toast.error('Algo deu errado');
		}
	}

	return (
		<section
			className="fixed bg-white bg-opacity-50 h-full w-full inset-0 grid place-items-center px-2"
			data-close={true}
			onClick={cancelShowUsers}
		>
			<div className="bg-zinc-900 p-5 w-full md:w-1/2 md:max-w-md rounded-md">
				{slicedUsers.length > 0 ? (
					<table className="border table-auto w-full">
						<thead>
							<tr className="bg-white text-black uppercase text-sm">
								<th className={`px-4 py-2`}>Nome</th>
								<th className={`px-4 py-2`}>Remover</th>
							</tr>
						</thead>
						<tbody className="text-white">
							{slicedUsers.map((user) => (
								<tr key={user.id} className={`border`}>
									<td className={`px-4 py-2 text-center border`}>
										{user.id == currentUser.id ? 'Você' : user.name}
									</td>
									<td
										className={`px-4 py-2 text-center border cursor-pointer`}
										onClick={removeUser}
										data-id={user.id}
									>
										<MdRemoveCircle
											size="1.5em"
											className="mx-auto text-red-600"
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<h1>Não há usuários nesta sala</h1>
				)}

				<button
					className="bg-green-700 hover:bg-green-800 mt-2 w-full rounded-md"
					data-close={true}
				>
					Fechar
				</button>

				{slicedUsers.length > usersPerPege && (
					<Paginate
						dataLength={users.length}
						dataPerPage={usersPerPege}
						setCurrentPage={setCurrentPage}
					/>
				)}
			</div>
		</section>
	);
}

export default ShowRoomUsers;
