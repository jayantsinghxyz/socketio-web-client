"use client";
import { useEffect, useState } from "react";
import { SocketSetup } from "./socket-setup";
import { ulid } from "ulid";

interface IConnection {
	id: string;
	name: string;
}

export default function Home() {
	const [connections, setConnections] = useState<Array<IConnection>>([]);
	const [currentConnection, setCurrentConnection] = useState<string | null>(
		null,
	);

	useEffect(() => {
		createNewConnection();
	}, []);

	function createNewConnection() {
		const connectionId = ulid();
		const connection = {
			id: connectionId,
			name: "Default Connection",
		};

		const newConnections = [...connections, connection];
		setConnections(newConnections);
		setCurrentConnection(connectionId);
	}

	return (
		<div className="flex flex-1 flex-col">
			<h1>Socketio Web Client</h1>

			<div className="flex flex-1 gap-6 h-full border-t border-neutral-800">
				<aside className="w-96 h-full border-r border-neutral-800">
					<ul className="flex flex-col p-4">
						<li
							key={"add-connection"}
							className="border border-neutral-800 rounded-md"
						>
							<button
								className="p-4"
								type="button"
								onClick={() => createNewConnection()}
							>
								<p>Create New Connection</p>
							</button>
						</li>

						{connections.map((connection) => {
							return (
								<li
									key={connection.id}
									className="border border-neutral-800 rounded-md"
								>
									<button
										className="p-4"
										type="button"
										onClick={() => setCurrentConnection(connection.id)}
									>
										<p> {connection.name}</p>
									</button>
								</li>
							);
						})}
					</ul>
				</aside>
				<div>
					{connections.map((connection) => (
						<SocketSetup
							key={connection.id}
							id={connection.id}
							isOpen={currentConnection === connection.id}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
