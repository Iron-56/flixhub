
import React from "react";
import { Poppins, Inter } from 'next/font/google';
import { useState } from "react";


const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '600'],
	variable: '--font-poppins',
});

const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '600'],
	variable: '--font-inter',
});

export default function PromptPopup({ isOpen, onClose }) {
	if (!isOpen) return null;
	

	const create = async () => {
		const name = document.getElementById("new-playlist-name").value;
		const isPublic = document.getElementById("new-playlist-public").checked;

		if (!name) return;

		try {
			const res = await fetch('http://localhost:5000/playlist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({name: name, public: isPublic}),
				credentials: 'include'
			});

			const msg = await res.text();
			console.log("Server response:", msg);
		} catch (err) {
			console.error('Search failed:', err);
		}
	};

	return (
		<div className="fixed text-center inset-0 bg-[rgba(2.25,40,46,0.85)] flex items-center justify-center p-4 z-50">
			<div className="bg-[#1E1E1E] w-full max-w-md flex flex-col items-center border border-[#000000] shadow-2xl rounded-2xl">
				<div className="p-6 flex flex-col items-center gap-6 justify-center text-sm sm:text-base">
					<div className="mt-3 text-sm sm:text-base">
						<p className="text-white font-medium">Playlist Name</p>
					</div>
					<input type="text" id="new-playlist-name" className="p-2 flex-1 text-white bg-[#2a2a2a] transition rounded-md" placeholder="Enter playlist name" />
					<div className="flex w-full gap-4 text-sm sm:text-base">
						<input type="checkbox" id="new-playlist-public" className=""/>
						<p className="text-white font-medium">Make it public</p>
					</div>
				</div>

				<div className="flex w-full border-t border-black divide-y sm:divide-y-0 sm:divide-x divide-black flex-col text-sm sm:flex-row sm:text-base">
					<button onClick={onClose} className="py-4 flex-1 text-white hover:bg-[#2a2a2a] rounded-bl-xl transition">Cancel</button>
					<button className="py-4 flex-1  hover:bg-[#2a2a2a] rounded-br-xl transition" onClick={create}>Create</button>
				</div>
			</div>
		</div>
	);
}
