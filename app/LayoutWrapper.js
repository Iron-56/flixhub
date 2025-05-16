'use client';

import { useState, useEffect } from 'react';
import LoginPopup from '@/components/LoginPopup';
import SettingsPopup from '@/components/SettingsPopup';
import ProfilePicture from '@/components/ProfilePicture';

export default function LayoutWrapper({ children, poppins, inter }) {

	const [isPopupOpen, setIsPopupOpen] = useState("null");
	const [userData, setUserData] = useState(null);
	const getUserData = async () => {
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
			setUserData(await res.json());
		} catch (err) {
			console.error('fetch onuser data failed:', err);
		}
	};


	useEffect(() => {
		getUserData();
	}, []);
	

	return (
		<div className="flex h-screen overflow-hidden">
			<aside className="min-w-fit max-w-70 w-[30%] bg-[#151515] hidden lg:flex flex-col p-4 items-center justify-center">
				<p className={`${poppins.className} text-center text-3xl font-black m-10`}>
					<span className="text-[#099EB8]">Flix</span><span className="text-[#FD3232]">Hub</span>
				</p>

				<div className="flex flex-col h-full w-full items-center">

					<div className={`${poppins.className} font-normal text-base flex-col gap-6 flex text-[#FFFFFF] p-4`}>
						<div>
							<p className='bold text-xl mb-4'>Menu</p>
							<div>
								<a className="flex hover:bg-[#2b2b2b] p-3 rounded-xl hover:scale-105 transition-all duration-200" href="/">
									<img src="Browse.svg" className="w-6 mr-2"/>
									<p>Browse</p>
								</a>
								<a className="flex hover:bg-[#2b2b2b] p-3 rounded-xl hover:scale-105 transition-all duration-200" href="/following">
									<img src="Followed.svg" className="w-6 mr-2" />
									<p>Following</p>
								</a>
								<a className="flex hover:bg-[#2b2b2b] p-3 rounded-xl hover:scale-105 transition-all duration-200" href="/followers">
									<img src="profile.svg" className="w-6 mr-2" />
									<p>Followers</p>
								</a>
							</div>
						</div>

						<div>
							<p className='bold text-xl mb-4'>Library</p>
							<div>
								<a className="flex hover:bg-[#2b2b2b] p-3 rounded-xl hover:scale-105 transition-all duration-200" href="/watch-later">
									<img src="Clock.svg" className="w-6 mr-2" />
									<p>Watch Later</p>
								</a>
								<a className="flex hover:bg-[#2b2b2b] p-3 rounded-xl hover:scale-105 transition-all duration-200" href="/playlist">
									<img src="Playlist.svg" className="w-6 mr-2" />
									<p>My Playlists</p>
								</a>
								<a className="flex hover:bg-[#2b2b2b] p-3 rounded-xl hover:scale-105 transition-all duration-200" href="/history">
									<img src="History.svg" className="w-6 mr-2" />
									<p>History</p>
								</a>
							</div>
						</div>
						
						<div>
							<p className='bold text-xl mb-4'>Settings</p>
							<div>
								<button className="flex hover:bg-[#2b2b2b] w-full p-3 rounded-xl hover:scale-105 transition-all duration-200" onClick={() => setIsPopupOpen("settings")}>
									<img src="Settings.svg" className="w-6 mr-2" />
									<p>About You</p>
								</button>
								<button className="flex hover:bg-[#2b2b2b] w-full p-3 rounded-xl hover:scale-105 transition-all duration-200">
									<img src="Logout.svg" className="w-6 mr-2" />
									<p>Logout</p>
								</button>
							</div>
						</div>
					</div>
					
				</div>
				<div className='flex gap-4 justify-around'>
					<p className='text-gray-400'>About</p>
					<p className='text-gray-400'>|</p>
					<p className='text-gray-400'>Contact</p>
					<p className='text-gray-400'>|</p>
					<p className='text-gray-400'>Github</p>
				</div>
			</aside>
				
			<main className={`${poppins.className} w-full h-full bg-[#1E1E1E] overflow-y-auto flex flex-col`}>

				<nav className="bg-[#1A1A1A] text-white p-4 flex flex-wrap gap-4 justify-between items-center">
					
					<p className={`${poppins.className} text-center text-2xl font-black my-1 hidden sm:block lg:hidden `}>
						<span className="text-[#099EB8]">Flix</span><span className="text-[#FD3232]">Hub</span>
					</p>

					<div className="flex items-center bg-[#272727] rounded-2xl px-4 py-2 min-w-40 flex-1 justify-between">
						<div className="flex min-w-0 ">
							<img src="Search.svg" />
							<input
								id="search"
								type="text"
								placeholder="Search"
								// onKeyDown={(e) => e.key === 'Enter' && search()}
								className="pl-4 min-w-0 bg-transparent outline-none text-gray-300 placeholder:text-gray-500"
							/>
						</div>
						<img src="Filter.svg" />
					</div>

					<div className="flex gap-4 items-center justify-between w-auto">
						{/* <button onClick={() => setIsPopupOpen("login")}>
							<img src="profile.svg" className="w-[24px] h-[24px] rounded-full" />
						</button> */}

						<ProfilePicture userId={userData?.id} onClick={() => setIsPopupOpen("login")}/>
					</div>
				</nav>
				{children}
			</main>

			<LoginPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen("null")} />
			<SettingsPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen("null")} />
		</div>
	);
}