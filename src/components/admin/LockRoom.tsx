import React from 'react';
import { useRooms } from '@/states/GlobalStates';
import { supabase } from '@/supabase/client';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function LockRoom({
	isPrivate,
	id,
}: {
	isPrivate: boolean;
	id: string;
}) {
	const { allRooms } = useRooms((state) => state);

	async function handleLockRoom() {
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
		<>
			{isPrivate ? (
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
		</>
	);
}
