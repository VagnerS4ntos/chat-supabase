'use client';
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CreateRoom from '@/components/admin/CreateRoom';
import EditRooms from '@/components/admin/EditRooms';
import ManageUsers from '@/components/admin/ManageUsers';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import _ from 'lodash';

function Admin() {
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		setLoading(false);
	}, []);

	return (
		<main className="container mt-4">
			<Tabs defaultFocus={true} forceRenderTabPanel={true}>
				<TabList>
					<Tab>Gerenciar salas</Tab>
					<Tab>Gerenciar usuários</Tab>
				</TabList>

				<TabPanel>
					<CreateRoom />
					{loading ? (
						<div className="mt-6">
							<AiOutlineLoading3Quarters
								size="2em"
								className="animate-spin mx-auto"
							/>
						</div>
					) : (
						<EditRooms />
					)}
				</TabPanel>
				<TabPanel>
					<ManageUsers />
				</TabPanel>
			</Tabs>
		</main>
	);
}

export default Admin;
