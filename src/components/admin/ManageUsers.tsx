'use client';
import React, { ChangeEvent } from 'react';
import { useUsers } from '@/states/GlobalStates';
import { useRouter } from 'next/navigation';
import { DebounceInput } from 'react-debounce-input';
import { userT } from '@/typescript/types';
import Paginate from '../Paginate';

function ManageUsers() {
	const router = useRouter();
	const { currentUser, allUsers } = useUsers((state) => state);

	const [currentPage, setCurrentPage] = React.useState(1);
	const usersPerPege = 10;
	const lastUserIndex = currentPage * usersPerPege;
	const firstUserIndex = lastUserIndex - usersPerPege;
	const [slicedUsers, setSlicedUsers] = React.useState<userT[]>([]);

	React.useEffect(() => {
		const slicedUsers = allUsers.slice(firstUserIndex, lastUserIndex);
		setSlicedUsers(slicedUsers);

		if (slicedUsers.length % 10 == 0 && currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	}, [allUsers]);

	function searchUser(event: ChangeEvent<HTMLInputElement>) {
		const filteredData = allUsers.filter(
			(user) =>
				user.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
				user.email.toLowerCase().includes(event.target.value.toLowerCase()),
		);

		const slicedRooms = filteredData.slice(firstUserIndex, lastUserIndex);
		setSlicedUsers(slicedRooms);
	}

	return (
		<section>
			<label htmlFor="searchUser">Buscar usuário</label>
			<DebounceInput
				minLength={1}
				debounceTimeout={500}
				onChange={searchUser}
				className="w-full rounded-md p-2 mt-1 text-black outline-none bg-white"
				placeholder="Buscar usuário por nome ou email"
				id="searchUser"
			/>
			{slicedUsers.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="border table-auto w-full mt-2">
						<thead>
							<tr className="bg-gray-200 text-black uppercase text-sm">
								<th className={`px-4 py-2 `}>Nome</th>
								<th className={`px-4 py-2 `}>Email</th>
							</tr>
						</thead>
						<tbody className="text-white">
							{slicedUsers
								.filter(
									(user) =>
										user.id != currentUser.id &&
										!user.name.includes('usuário excluído'),
								)
								.map((user) => (
									<tr
										key={user.id}
										className={`cursor-pointer border hover:bg-zinc-700`}
										onClick={() => router.push(`/admin/user/${user.id}`)}
									>
										<td className={`px-4 py-2 text-center border relative`}>
											{user.name}
										</td>
										<td className={`px-4 py-2 text-center border`}>
											{user.email}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			) : (
				<h1 className="text-xl mt-5">Nenhum usuário encontrado</h1>
			)}

			{slicedUsers.length > usersPerPege && (
				<Paginate
					dataLength={allUsers.length}
					dataPerPage={usersPerPege}
					setCurrentPage={setCurrentPage}
				/>
			)}
		</section>
	);
}

export default ManageUsers;
