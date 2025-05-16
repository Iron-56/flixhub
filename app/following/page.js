'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Poppins, Inter } from 'next/font/google';
import PromptPopup from "@/components/PromptPopup";
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

export default function Home() {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [following, setFollowing] = useState([]);

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
			if (res.status !== 200) {
				console.error('Error fetching following users:', data);
				return;
			}
			return data;
		} catch (err) {
			console.error('Error on fetching following users', err);
		}
	};

	const fetchFollowing = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/following`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			const data = await res.json();
			console.log(data);
			if (res.status !== 200) {
				console.error('Error fetching following users:', data);
				return;
			}
			let users = []
			for (let i = 0; i < data.length; i++) {
				const user = await fetchUserName(data[i].follow_user_id);
				user.followed = true;
				users.push(user);
			}
			console.log(users)
			setFollowing(users);
		} catch (err) {
			console.error('Error on fetching following users', err);
		}
	};

	const emptyFollowing = () => {
		if (following.length === 0) {
			return (
				<div className="flex flex-col m-2">
					<p className="text-lg">You are not following anyone.</p>
				</div>
			);
		}
		return null;
	};

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
	
			setFollowing((prevFollowers) =>
				prevFollowers.map((user) =>
					user.id === userId ? { ...user, followed: true } : user
				)
			);
		} catch (err) {
			console.error('Error on fetching follow user', err);
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
	
			setFollowing((prevFollowers) =>
				prevFollowers.map((user) =>
					user.id === userId ? { ...user, followed: false } : user
				)
			);
		} catch (err) {
			console.error('Error unfollowing user', err);
		}
	};
	

	useEffect(() => {
		fetchFollowing();
	}, []);

	return (
		<div>
			<div className="flex flex-col gap-6 p-2 sm:p-6 md:p-12">
				<p className="text-3xl mt-2 font-black">Following</p>
				<div className="flex flex-col gap-2">
					{emptyFollowing()}
					{following?.map((user, index) => (
						<div className="flex w-full bg-[#282828] justify-between gap-4 sm:flex-row flex-col lg:flex-nowrap px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
							<div className="flex gap-6 items-center">
								<ProfilePicture key={index} userId={user.id} alt="Profile Picture" className="h-10 w-10 rounded-xl"/>
								<p>{user.name}</p>
							</div>
							<div className="flex gap-2 sm:flex-col justify-between items-end sm:justify-center">
								{ user.followed
									? <button onClick={() => unfollowUser(user.id)} className="bg-[#1A1A1A] cursor-pointer px-4 py-2 rounded-xl">Following</button>
									: <button onClick={() => followUser(user.id)} className="bg-[#0094D4] cursor-pointer px-4 py-2 rounded-xl">Follow</button>
								}
							</div>
						</div>
					))}
				</div>
				
			</div>

		</div>
		
	);
}