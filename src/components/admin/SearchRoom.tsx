import { useRooms } from '@/states/GlobalStates';
import { roomT } from '@/typescript/types';
import React, { ChangeEvent } from 'react';
import { DebounceInput } from 'react-debounce-input';

const SearchRoom = ({
	setFilteredData,
	setSlicedRooms,
	firstRoomIndex,
	lastRoomIndex,
}: {
	setFilteredData: React.Dispatch<React.SetStateAction<roomT[]>>;
	setSlicedRooms: React.Dispatch<React.SetStateAction<roomT[]>>;
	firstRoomIndex: number;
	lastRoomIndex: number;
}) => {
	const { allRooms } = useRooms((state) => state);

	const searchRoom = (event: ChangeEvent<HTMLInputElement>) => {
		const filteredData = allRooms.filter((room) =>
			room.name.toLowerCase().includes(event.target.value.toLowerCase()),
		);
		setFilteredData(filteredData);
		const slicedRooms = filteredData.slice(firstRoomIndex, lastRoomIndex);
		setSlicedRooms(slicedRooms);
	};

	return (
		<>
			<label htmlFor="searchRoom">Buscar sala</label>
			<DebounceInput
				minLength={1}
				debounceTimeout={500}
				onChange={searchRoom}
				className="w-full rounded-md p-2 mt-1 text-black outline-none bg-white"
				placeholder="Buscar sala"
				id="searchRoom"
			/>
		</>
	);
};

export default React.memo(SearchRoom);
