import React from 'react';
import { adminAuthClient } from '@/supabase/admin';
import { toast } from 'react-toastify';
import { useUsers } from '@/states/GlobalStates';

function ChangeUserFunction({ id }: { id: string }) {
	const [userFunction, setUserFunction] = React.useState<string>('');
	const [error, setError] = React.useState('');
	const { allUsers } = useUsers((state) => state);

	async function save() {
		const currentUser = allUsers.filter((user) => user.id == id)[0];

		if (
			(currentUser.role == null && userFunction == '') ||
			currentUser.role == userFunction
		) {
			toast.info(`${currentUser.name} já está com essa função`);
			return;
		}
		const { error } = await adminAuthClient.updateUserById(id, {
			user_metadata: { role: userFunction },
		});
		if (error) {
			setError(error.message);
			return;
		}
		toast.success('Usuário atualizado com sucesso!');
	}

	return (
		<section className="">
			<select
				className="mt-1 p-2 rounded-md text-black"
				value={userFunction}
				onChange={({ target }) => setUserFunction(target.value)}
			>
				<option value={''}>Usuário</option>
				<option value="admin">Administrador</option>
			</select>
			<button
				className="p-2 rounded-md mt-3 bg-blue-500 hover:bg-blue-600 ml-4"
				onClick={save}
			>
				Salvar
			</button>
			<p className="text-red-500">{error}</p>
		</section>
	);
}

export default ChangeUserFunction;
