
import React from "react";
import { Poppins, Inter } from 'next/font/google';
import { useState, useEffect } from "react";
import PromptPopup from "./PromptPopup";
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

export default function SettingsPopup({ isOpen, onClose }) {
	if (isOpen != "settings") return null;
	const [enabled, setEnabled] = useState(true);
	const [showPrompt, setShowPrompt] = useState(false);
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

	const handleChangeProfilePicture = (e) => {
		const formData = new FormData();
		formData.append('image', e.target.files[0]);
	
		fetch('http://127.0.0.1:5000/upload', {
			method: 'POST',
			body: formData,
			credentials: 'include'
		})
		.then(res => res.text())
		.then(msg => {
			console.log(msg);
		})
		.catch(err => {
			console.error(err);
		});
	};
	

	useEffect(() => {
		getUserData();
	}, []);
	

	return (
		<div className="fixed inset-0 bg-[rgba(2.25,40,46,0.85)]  flex items-center justify-center sm:p-4 z-50">
			<div className="bg-[#1E1E1E] flex flex-col items-center w-full h-full sm:w-[500] sm:h-fit border border-[#ff0000] shadow-2xl sm:justify-around gap-2 sm:rounded-2xl relative">
			
				<nav className="bg-[#1A1A1A] flex rounded-t-2xl w-full justify-between">
					<div className="flex items-center gap-4 p-6">
						{/* <img src="profile.svg" className="w-6 h-6 rounded-full" /> */}
						<ProfilePicture userId={userData?.id}/>
						<p>{userData?.name}</p>
					</div>
					<div className="flex items-center gap-4 p-6">
						<button className=" rounded-lg"><img src="Logout.svg" className="w-4 h-4" /></button>
						<button onClick={onClose} className="bg-[#2C2C2C] p-2.5 rounded-lg text-[#989898] text-xl flex items-center justify-center w-[36px] h-[36px]">✖</button>
					</div>
				</nav>

				<div className="p-6 w-full flex flex-col text-sm gap-6">
					<div>
						<p className="text-[#CCCCCC] text-2xl font-semibold">About You</p>
						<div className="flex flex-col w-full p-4 gap-4">
							<div className="flex justify-between w-full items-center">
								<div className="flex gap-4">
									<p>Username: </p>
									<p>{userData?.name}</p>
								</div>
								<button className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Change</button>
							</div>
							<div className="flex justify-between w-full items-center">
								<div className="flex gap-4">
									<p>User Id: </p>
									<p>{userData?.id}</p>
								</div>
								<button className="py-2 px-4 rounded-xl bg-[#2C2C2C]">Change</button>
							</div>
							<div className="flex justify-between w-full items-center">
								<label htmlFor="profile-upload" className="py-2 px-4 rounded-xl bg-[#2C2C2C] flex items-center gap-2 cursor-pointer">
									<ProfilePicture userId={userData?.id}/>
									<span>Change Profile Picture</span>
								</label>
								<input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleChangeProfilePicture}/>
							</div>
						</div>
					</div>

					<div>
						<p className="text-[#CCCCCC] text-2xl font-semibold">Your Activity</p>
						<div className="flex justify-between p-4 w-full items-center gap-4 flex-wrap">
							<p>Share your Activity</p>
							<div className={`flex items-center space-x-4 ${enabled ? "text-green-600" : "text-red-600"}  rounded`}>
								<span className="hidden sm:block">{enabled ? "Enabled" : "Disabled"}</span>
								<button onClick={() => setEnabled(!enabled)} className={`w-16 h-8 flex items-center rounded-lg p-1 transition-colors duration-300 ${enabled ? "bg-black" : "bg-gray-700"}`}>
									<div className={`w-8 h-6 rounded-lg transition-transform duration-300 ${enabled ? "translate-x-6 bg-green-600" : "translate-x-0 bg-gray-400"}`}></div>
								</button>
							</div>
						</div>
					</div>


					<div>
						<p className="text-[#CCCCCC] text-2xl font-semibold">Your Interests</p>
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

					<button className="bg-[#B90000] rounded-xl py-3 px-6 flex items-center self-center sm:self-end gap-2 font-semibold shadow-lg" onClick={() => setShowPrompt(true)}>
						<p>Delete Account</p>
						<img src="trash.svg" className="w-4 h-4" />
					</button>

				</div>
			</div>
			<PromptPopup isOpen={showPrompt} prompt="Are you sure you want to delete your account?" warning="This action is permanent and cannot be undone." accept="Delete" onClose={() => setShowPrompt(false)}/>
		</div>
	);
}
