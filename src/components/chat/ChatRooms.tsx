'use client';
import {
	useMessages,
	useMobileMenu,
	useRooms,
	useUsers,
} from '@/states/GlobalStates';
import { supabase } from '@/supabase/client';
import { messagesT, roomT } from '@/typescript/types';
import React, { ChangeEvent } from 'react';
import { DebounceInput } from 'react-debounce-input';
import _ from 'lodash';
import { MagicMotion } from 'react-magic-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';

function ChatRooms() {
	const { allRooms, getCurrentRoom, currentRoom } = useRooms((state) => state);
	const { currentUser } = useUsers((state) => state);
	const { getCurrentRoomMessages } = useMessages((state) => state);
	const { showMobile, setShowMobile } = useMobileMenu((state) => state);
	const [renderRoomData, setRenderRoomData] = React.useState<roomT[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		setRenderRoomData(allRooms);
		if (allRooms.length > 0) {
			setLoading(false);
		}
	}, [allRooms]);

	function searchRoom(event: ChangeEvent<HTMLInputElement>) {
		const filteredData = allRooms.filter((room) =>
			room.name.toLowerCase().includes(event.target.value.toLowerCase()),
		);
		setRenderRoomData(filteredData);
	}

	async function getUsersOnRoom(event: any) {
		const { room_id } = event.target.closest('[data-room_id]').dataset;

		//Condicional para não fazer requisição à toa
		if (room_id !== currentRoom.id) {
			//Atualiza no banco de dados a sala em que o usuário entrou
			const { error } = await supabase
				.from('users')
				.update({ public_room: room_id })
				.eq('id', currentUser.id);

			if (error) {
				toast.error(error.message);
				return;
			}

			//Pega a sala selecionada
			const currentRoom = allRooms.filter((room) => room.id == room_id)[0];
			getCurrentRoom(currentRoom);

			//Pega as mensagens da sala selecionada
			const { data: messages, error: messageError } = await supabase
				.from('messages')
				.select()
				.eq('room_id', room_id)
				.returns<messagesT[]>();

			if (messageError) {
				toast.error(messageError.message);
				return;
			}
			getCurrentRoomMessages(messages);
			setShowMobile('chat');
		}
	}

	return (
		<section
			className={`sm:w-60  px-2 rounded-md bg-white overflow-hidden h-full ${
				showMobile !== 'rooms' ? 'hidden' : 'w-full'
			}`}
		>
			<div className="h-24">
				<p className="uppercase p-2 text-black">Salas</p>
				<div className="flex bg-zinc-200 text-black items-center rounded-md">
					<DebounceInput
						minLength={1}
						debounceTimeout={500}
						onChange={searchRoom}
						className="w-full rounded-md p-2 bg-inherit"
						placeholder="Buscar sala"
					/>
				</div>
			</div>

			{loading ? (
				<span className="text-black grid place-items-center">
					<AiOutlineLoading3Quarters size="1.5em" className="animate-spin" />
				</span>
			) : (
				<MagicMotion>
					<div className="max-h-full overflow-y-scroll scroll_height">
						{renderRoomData.length > 0 ? (
							renderRoomData.map(({ id, name, private_room }) => (
								<button
									key={id}
									onClick={getUsersOnRoom}
									data-room_id={id}
									className={`w-full rounded-md mb-1 px-2 py-1 border ${
										currentRoom.id == id
											? 'bg-zinc-900 text-white'
											: 'text-black hover:bg-zinc-900 hover:text-white'
									}   ${
										private_room && currentUser.role != 'admin'
											? 'cursor-not-allowed'
											: ''
									}`}
									disabled={private_room && currentUser.role != 'admin'}
									title={private_room ? 'Sala bloqueada' : ''}
								>
									{name}
								</button>
							))
						) : (
							<p className="text-black">Nenhuma sala encontrada</p>
						)}
					</div>
				</MagicMotion>
			)}
		</section>
	);
}

export default ChatRooms;
