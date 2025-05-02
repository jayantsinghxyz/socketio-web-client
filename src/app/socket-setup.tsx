"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { io, type Socket } from "socket.io-client";
import { z } from "zod";

const formSchema = z.object({
	url: z.string().url(),
	auth: z
		.object({
			token: z.string(),
		})
		.nullable(),
});
type IFormSchema = z.infer<typeof formSchema>;

interface Props {
	id: string;
	isOpen: boolean;
}

export const SocketSetup: FC<Props> = ({ isOpen }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const {
		register,
		// setValue,
		handleSubmit,
		// formState: {},
	} = useForm<IFormSchema>({
		resolver: zodResolver(formSchema),
	});
	const onSubmit = handleSubmit((data) => {
		initSocket(data);
	});

	function initSocket(data: IFormSchema) {
		if (socket) {
			socket.disconnect();
		}
		const s = io(data.url, {
			auth: {
				token: data.auth?.token,
			},
		});

		setupEvents(s);

		setSocket(s);
	}

	function setupEvents(s: Socket) {
		s.on("connect", () => {
			setIsConnected(true);
			console.log("connected");
		});

		s.on("disconnect", () => {
			setIsConnected(false);
			s.off("connect");
			s.off("disconnect");
			console.log("disconnected");
		});
	}

	useEffect(() => {
		console.log("mount fc");

		return () => {
			console.log("un mount fc");
		};
	});

	return (
		<div className={`${isOpen ? "flex" : "hidden"} flex-1`}>
			<input type="checkbox" checked={isConnected} />
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				<div>
					<label>
						URL
						<input
							{...register("url")}
							className="border border-neutral-800 rounded-md px-4 py-3"
						/>
					</label>
				</div>
				<div>
					<label>
						Auth token
						<input
							{...register("auth.token")}
							className="border border-neutral-800 rounded-md px-4 py-3"
						/>
					</label>
				</div>
				<button type="submit">CONNECT</button>
			</form>
		</div>
	);
};
