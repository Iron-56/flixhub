
import React from "react";
import { Poppins, Inter } from 'next/font/google';
import { useState, useEffect } from "react";
import Tile from "@/components/Tile";
import ProfilePicture from "@/components/ProfilePicture";

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

export default function ProfilePopup({userId, isOpen, onClose }) {
	if (!isOpen) return null;
	const [enabled, setEnabled] = useState(true);
	const [movies, setMovies] = useState(null);
	const [userData, setUserData] = useState(null);
	const [followed, setFollowed] = useState(false);

	const fetchWatchHistory = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/history/${userId}`, {
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

	const fetchUserData = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/userdata/${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			const data = await res.json();
			if (res.status !== 200) {
				console.error('Error fetching user data', data);
				return;
			}

			setUserData(data);

			var selfUserId = null;

			try {
				const res = await fetch(`http://127.0.0.1:5000/about`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});
				if (res.status !== 200) {
					console.error('Error fetching user data:', res.statusText);
					return;
				}
				selfUserId = await res.json();
				console.log(selfUserId);
			} catch (err) {
				console.error('fetch onuser data failed:', err);
			}

			for (let i = 0; i < data.followers.length; i++) {
				if (data.followers[i].id === selfUserId.id) {
					setFollowed(true);
					break;
				}
			}
		} catch (err) {
			console.error('Error on fetching user data', err);
		}
	};

	const emptyRecents = () => {
		if (movies?.length === 0) {
			return (
				<p className="text-[#CCCCCC] text-lg m-2 font-medium">No recent movies</p>
			);
		}
	}

	const followUser = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/follow/${userId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			if (res.status !== 200) {
				console.error('Error fetching follow user:', res.status);
				return;
			}
			setFollowed(true);
		} catch (err) {
			console.error('Error on fetching follow user', err);
		}
	};

	const unfollowUser = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/follow/${userId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			if (res.status !== 200) {
				console.error('Error fetching watch later movies', res.status);
				return;
			}
			setFollowed(false);
		} catch (err) {
			console.error('Error on fetching watch later movies', err);
		}
	};

	// const emptyInterests = () => {
	// 	if (userData?.interests?.length === 0) {
	// 		return (
	// 			<div className="flex flex-col items-center justify-center">
	// 				<p className="text-[#CCCCCC] text-xl font-semibold">No interests</p>
	// 			</div>
	// 		);
	// 	}
	// }

	useEffect(() => {
		if (isOpen) {
			
			fetchWatchHistory();
			fetchUserData();
		}
	}, [isOpen]);

	return (
		<div className="fixed inset-0 bg-[rgba(2.25,40,46,0.85)]  flex items-center justify-center sm:p-4 z-50">
			<div className="bg-[#1E1E1E] flex flex-col items-center w-full h-full sm:w-[500] sm:h-fit border border-[#ff0000] shadow-2xl sm:justify-around gap-2 sm:rounded-2xl relative">
			
				<nav className="bg-[#1A1A1A] flex rounded-t-2xl w-full justify-between">
					<div className="flex items-center gap-4 p-6">
						<ProfilePicture userId={userId}/>
						<p>{userData?.name}</p>
					</div>
					<div className="flex items-center gap-4 p-6">
						{/* <button className="bg-[#2C2C2C] flex items-center p-2 gap-2 rounded-lg"> */}
							{ followed
								? <a className="bg-[#2A2A2A] p-2 rounded-lg cursor-pointer text-sm text-center font-semibold" onClick={unfollowUser}>Following</a>
								: <a className="bg-[#0094D4] p-2 rounded-lg cursor-pointer text-sm text-center font-semibold" onClick={followUser}>Follow</a>
							}
						{/* </button> */}
						<button onClick={onClose} className="bg-[#2C2C2C] p-2.5 rounded-lg text-[#989898] cursor-pointer text-md flex items-center justify-center w-[36px] h-[36px]">✖</button>
					</div>
				</nav>

				<div className="p-6 w-full flex flex-col sm:max-h-150 overflow-auto text-sm gap-6">
					<div>
						<p className="text-[#CCCCCC] text-xl font-semibold">Recent</p>
						<div className="flex gap-4 overflow-x-auto p-2 overflow-y-visible items-center">
							{/* <div className="flex gap-4 flex-2/3 flex-col sm:flex-row">
								<div className="relative bg-[url('/poster2.png')] md:min-w-1/2 bg-cover  bg-center rounded-3xl overflow-hidden flex-2">
									<div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
									<div className="justify-between relative h-full p-6 text-white flex flex-col">
										<div className="flex flex-col gap-4 w-min text-sm text-gray-300 mb-2">
											<h1 className="text-3xl font-black">Batman Begins</h1>
											<div className="flex justify-between">
												<p>2016</p>
											</div>
										</div>
										<div className="flex gap-2 w-min font-semibold justify-center items-center">
											<button className="bg-[#FF0000] py-2 flex-1 px-4 rounded-xl">Watch</button>
										</div>
									</div>
								</div>
								<div className="flex gap-4 sm:flex-col min-w-fit overflow-auto m-auto justify-around">
									<img src="playlist1.png" className="w-18"/>
									<img src="playlist2.png" className="w-18"/>
									<img src="playlist3.png" className="w-18"/>
									<img src="movie1.png" className="w-18"/>
								</div>
							</div> */}
							{emptyRecents()}
							{ movies?.map((poster) => (
								(poster.poster_path && (
									<Tile key={poster.id} title={poster.title} poster={poster.poster_path} overview={poster.overview} rating={poster.vote_average}/>
								))
							))}
						</div>
						
						
						<div>
							<p className="text-[#CCCCCC] text-xl font-semibold">Interests</p>
							<div className="flex flex-wrap justify-center gap-4 p-4 w-full items-center">
								<div className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Horror</div>
								<div className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Thriller</div>
								<div className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Action</div>
								<div className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Crime & Investigation</div>
								<div className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Sports</div>
								<div className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Action</div>
								<div className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Adventure</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	);
}
