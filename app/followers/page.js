"use client"

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Poppins, Inter } from 'next/font/google';
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

export default function Followers() {

	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);

	const followUser = async (userId) => {
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
	
			setFollowers((prevFollowers) =>
				prevFollowers.map((user) =>
					user.id === userId ? { ...user, followed: true } : user
				)
			);
		} catch (err) {
			console.error('Error on fetching follow user', err);
		}
	};
	

	const fetchUserName = async (id) => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/about/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			const data = await res.json();
			console.log(data);
			if (res.status !== 200) {
				console.error('Error fetching followers:', data);
				return;
			}
			return data;
		} catch (err) {
			console.error('Error on fetching followers', err);
		}
	};

	const unfollowUser = async (userId) => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/follow/${userId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			if (res.status !== 200) {
				console.error('Error unfollowing user:', res.status);
				return;
			}
	
			setFollowers((prevFollowers) =>
				prevFollowers.map((user) =>
					user.id === userId ? { ...user, followed: false } : user
				)
			);
		} catch (err) {
			console.error('Error unfollowing user', err);
		}
	};
	

	const fetchFollowers = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/followers`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});

			const data = await res.json();
			if (res.status !== 200) {
				console.error('Error fetching following users:', data);
				return;
			}

			try {
				const res = await fetch(`http://127.0.0.1:5000/following`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});
				const followed = await res.json();

				let users = []

				for (let i = 0; i < data.length; i++) {
					let user = await fetchUserName(data[i].user_id);
					user.followed = false;
					for (let j = 0; j < followed.length; j++) {
						if (data[i].user_id === followed[j].follow_user_id) {
							user.followed = true;
							break;
						}
					}
					users.push(user);
				}

				console.log(users)
				setFollowers(users);

			} catch (err) {
				console.error('Error on fetching following users', err);
			}
			
		} catch (err) {
			console.error('Error on fetching following users', err);
		}
	};

	
	useEffect(() => {
		fetchFollowers();
	}, []);

	const noFollowers = () => {
		if (followers.length === 0) {
			return (
				<div className="flex flex-col m-2">
					<p className="text-lg">You currently have no followers.</p>
				</div>
			);
		}
	};

	return (
		<div className="flex flex-col gap-6 p-2 sm:p-6 md:p-12">
			<p className="text-3xl mt-2 font-black">Your Followers</p>
			<div className="flex flex-col gap-2">
				{noFollowers()}
				{followers && followers.map((user, index) => (
					<div key={index} className="flex w-full bg-[#282828] justify-between gap-4 lg:flex-nowrap px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
						<div className="flex gap-4 items-center">
							<ProfilePicture userId={user.id} />
							<p>{user.name} has followed you.</p>
						</div>
						<div className="flex gap-2 sm:flex-col justify-between items-end sm:justify-center">
							{ user.followed
								? <a className="bg-[#1A1A1A] px-4 py-2 rounded-xl cursor-pointer" onClick={() => unfollowUser(user.id)}>Unfollow</a>
								: <a className="bg-[#0094D4] px-4 py-2 rounded-xl cursor-pointer" onClick={() => followUser(user.id)}>Follow</a>

							}
							{/* <p className="text-sm">18d</p> */}
						</div>
					</div>
				))}
				{/* <div className="flex w-full bg-[#282828] justify-between gap-4 sm:flex-row flex-col lg:flex-nowrap px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
					<div className="flex gap-6 items-center">
						<img src="profile.svg" className="h-10 w-10 rounded-xl"/>
						<p>User has followed you.</p>
					</div>
					<div className="flex gap-2 sm:flex-col justify-between items-end sm:justify-center">
						<p className="text-[#0094D4] text-lg">Follow back</p>
						<p className="text-sm">18d</p>
					</div>
				</div>
				<div className="flex w-full bg-[#282828] justify-between gap-4 sm:flex-row flex-col lg:flex-nowrap px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
					<div className="flex gap-6 items-center">
						<img src="profile.svg" className="h-10 w-10 rounded-xl"/>
						<p>User has followed you.</p>
					</div>
					<div className="flex gap-2 sm:flex-col justify-between items-end sm:justify-center">
						<p className="text-[#0094D4] text-lg">Follow back</p>
						<p className="text-sm">18d</p>
					</div>
				</div>
				<div className="flex w-full bg-[#282828] justify-between gap-4 sm:flex-row flex-col lg:flex-nowrap px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
					<div className="flex gap-6 items-center">
						<img src="profile.svg" className="h-10 w-10 rounded-xl"/>
						<p>User has followed you.</p>
					</div>
					<div className="flex gap-2 sm:flex-col justify-between items-end sm:justify-center">
						<p className="text-[#0094D4] text-lg">Follow back</p>
						<p className="text-sm">18d</p>
					</div>
				</div>
				<div className="flex w-full bg-[#282828] justify-between gap-4 sm:flex-row flex-col lg:flex-nowrap px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
					<div className="flex gap-6 items-center">
						<img src="profile.svg" className="h-10 w-10 rounded-xl"/>
						<p>User has followed you.</p>
					</div>
					<div className="flex gap-2 sm:flex-col justify-between items-end sm:justify-center">
						<p className="text-[#0094D4] text-lg">Follow back</p>
						<p className="text-sm">18d</p>
					</div>
				</div> */}
			</div>
		</div>
	);
}