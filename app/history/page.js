"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Poppins, Inter } from 'next/font/google';
import PromptPopup from "@/components/PromptPopup";

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

export default function WatchLater() {

	const [movies, setMovies] = useState(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState(null);

	const selectMovie = (movie) => {
		setSelectedMovie(movie);
		removeFromWatchhistory();
		// setShowPrompt(true);
	};

	const fetchWatchhistory = async () => {
		try {
			const res = await fetch('http://127.0.0.1:5000/history', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			const data = await res.json();
			if (res.status !== 200) {
				console.error('Error fetching watch later movies:', data);
				return;
			}
			setMovies(data);
		} catch (err) {
			console.error('Error on fetching watch later movies', err);
		}
	};

	const removeFromWatchhistory = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/history?movieId=${selectedMovie.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			// const data = await res.json();
			if (res.status !== 200) {
				console.error('Error deleting movie from watch history', data);
				return;
			}
			fetchWatchhistory();
			// setMovies(data);
		} catch (err) {
			console.error('Error on deleting movie from watch history', err);
		}

		setShowPrompt(false);
	};

	useEffect(() => {
		fetchWatchhistory();
	}, []);

	const emptyWatchhistory = (
		<div className="flex flex-col items-center h-full justify-center p-8 text-center bg-[#151515] rounded-xl">
			<p className="text-xl text-gray-400 mt-4">Your watch history is empty!</p>
			<p className="text-md text-gray-500">Your watched movies appear here.</p>
			<a className="mt-4 px-6 py-2 bg-[#FF0000] rounded-xl text-white hover:scale-105 duration-200" href="/">Get Started!</a>
		</div>
	);

	return (
		<div className="flex flex-col gap-3 p-2 h-full sm:p-6 ">
			{ movies?.length === 0 ? emptyWatchhistory : (
				<div className="flex w-full h-full rounded-4xl flex-col gap-4">
					<div className="flex w-full gap-4 items-stretch justify-center flex-wrap lg:flex-nowrap">
					
						<div className="flex gap-2 flex-col justify-center sm:hidden">
							<img src={`https://image.tmdb.org/t/p/w500${movies?.[0]?.poster_path}`} className="rounded-xl w-full "/>
							<div className="flex flex-wrap gap-2 w-full font-semibold justify-center">
								<button className="bg-[#FF0000] py-2 px-4 rounded-lg flex-1">Watch</button>
							</div>
						</div>

						<div className="justify-between relative p-6 text-white flex flex-col sm:hidden m-auto w-full gap-4">
							
							<div className="flex flex-col gap-4 w-full text-sm text-gray-300 mb-2">
								<div className="flex justify-between">
									<h1 className="text-2xl font-black sm:text-4xl">{movies?.[0]?.title}</h1>
								</div>
								<div className="flex justify-between">
								<p>{movies?.[0]?.release_date?.slice(0, 4)}</p>

									<p className="text-[#E0DC5F]">{movies?.[0]?.vote_average}/10</p>
								</div>
								<p className="mb-4 text-xs text-gray-300 max-w-xl lg:hidden sm:text-sm"> {movies?.[0]?.overview} </p>
							</div>
						</div>

						<div className="hidden relative h-100 sm:flex gap-8 justify-around items-stretch w-full">
							<img src={`https://image.tmdb.org/t/p/original${movies?.[0]?.backdrop_path}`} className=" object-cover w-full rounded-xl"/>

							<div className="absolute rounded-xl inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

							<div className="absolute inset-0 flex w-fit flex-col justify-end p-6 text-white z-10">
								<div className="flex flex-col gap-4 text-sm text-gray-300 mb-2">
									<h1 className="text-4xl font-black">{movies?.[0]?.title}</h1>
									<div className="flex justify-between">
										<p>{movies?.[0]?.release_date?.slice(0, 4)}</p>
										<p className="text-[#E0DC5F]">{movies?.[0]?.vote_average}/10</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button className="bg-[#FF0000] py-2 px-4 flex-1 rounded-lg hover:scale-110 duration-100">Watch</button>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-1 gap-4 flex-col w-full">
						{movies?.map((poster) => (
							<div key={poster.id} className="flex gap-4 shadow-xl/30 p-4 rounded-2xl border-black border-1 h-48">
								<img src={`https://image.tmdb.org/t/p/w500${poster.poster_path}`} className="rounded-xl"/>
								<div className="flex flex-col h-full gap-2">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-[#A9A9A9] text-2xl">{poster.title}</p>
											<p className="text-[#414141]">{poster.release_date?.slice(0, 4)}</p>
										</div>
										<button onClick={() => selectMovie(poster)} className="hover:scale-105 duration-200">
											<img src="trash.svg" className="p-3 bg-[#080808] rounded-lg"/>
										</button>
									</div>
									<p className="text-[#A9A9A9] md:text-sm text-xs overflow-y-auto">{poster.overview}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
			{/* <PromptPopup isOpen={showPrompt} prompt={`Remove ${selectedMovie?.title} from watch history?`} accept="Remove" onClose={() => removeFromWatchhistory()}/> */}
		</div>

	);
}