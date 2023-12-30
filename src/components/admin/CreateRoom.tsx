'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/supabase/client';
import { toast } from 'react-toastify';
import { useRooms } from '@/states/GlobalStates';

const schema = z.object({
	name: z
		.string()
		.min(3, { message: 'O nome da sala precisa ter pelo menos 3 caracteres' }),
});

type FormProps = z.infer<typeof schema>;

function CreateRoom() {
	const { allRooms } = useRooms((state) => state);
	const [error, setError] = React.useState('');

	const {
		register,
		handleSubmit,
		resetField,
		formState: { errors, isSubmitSuccessful },
	} = useForm<FormProps>({
		resolver: zodResolver(schema),
	});

	const createRoom: SubmitHandler<FormProps> = async ({ name }) => {
		const nameExists = allRooms.some(
			(room) =>
				room.name.toLowerCase() ===
				name.toLowerCase().replace(/\s+/g, ' ').trim(),
		);
		if (nameExists) {
			toast.error('Esta sala já existe. Escolha outro nome');
			return;
		} else {
			const { error } = await supabase.from('rooms').insert({ name });
			if (error) {
				setError(error.message);
				return;
			}
			toast.success('Sala criada com sucesso!');
		}
	};

	React.useEffect(() => {
		if (isSubmitSuccessful) {
			resetField('name');
		}
	}, [isSubmitSuccessful]);

	return (
		<div className="border-b pb-10">
			<h1 className="text-xl uppercase">Criar sala</h1>
			<form onSubmit={handleSubmit(createRoom)}>
				<label htmlFor="email">Nome da sala</label>
				<input
					type="text"
					id="email"
					placeholder="Nome"
					className={`mt-1 p-2 w-full border rounded-md text-black ${
						errors.name ? 'border-red-500' : 'border-gray-400'
					}`}
					{...register('name')}
				/>
				<span className="text-red-500 text-sm block">
					{errors.name?.message}
				</span>
				<span className="text-red-500 text-sm block">{error}</span>
				<button className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded-md mt-2">
					Salvar
				</button>
			</form>
		</div>
	);
}

export default CreateRoom;
