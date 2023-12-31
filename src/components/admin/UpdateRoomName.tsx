import { useRooms } from '@/states/GlobalStates';
import { supabase } from '@/supabase/client';
import React from 'react';
import { toast } from 'react-toastify';

export default function UpdateRoomName({
	currentName,
}: {
	currentName: string;
}) {
	const { allRooms } = useRooms((state) => state);
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

	return (
		<form onSubmit={updateRoomName}>
			<input
				type="text"
				defaultValue={currentName}
				className="text-center bg-zinc-900 text-white border"
				onChange={({ target }) => setNewName(target.value.trim())}
			/>
			<button className="bg-zinc-900 hover:bg-zinc-700 border px-2">
				Atualizar
			</button>
		</form>
	);
}
