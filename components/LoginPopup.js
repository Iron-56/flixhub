import React, { useState } from "react";
import { Poppins, Inter } from 'next/font/google';

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

export default function LoginPopup({ isOpen, onClose }) {
	const [activeTab, setActiveTab] = useState("register");

	if (isOpen !== "login") return null;

	const register = async (e) => {
		e.preventDefault();
		
		try {

			const res = await fetch('http://127.0.0.1:5000/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: document.getElementById('register-username').value,
					userId: document.getElementById('register-userId').value,
					password: document.getElementById('register-password').value,
				}),
				credentials: 'include'
			});

			onClose();
		} catch (err) {
			console.error('Error submitting form:', err);
		}
	};

	const login = async (e) => {
		e.preventDefault();
		
		try {

			const res = await fetch('http://127.0.0.1:5000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: document.getElementById('login-userId').value,
					password: document.getElementById('login-password').value,
				}),
				credentials: 'include'
			});
			console.log(await res.text());
			fetch('http://127.0.0.1:5000/session', {
				credentials: 'include'
			  }).then(res => res.json()).then(console.log);
			  
			onClose();
		} catch (err) {
			console.error('Error submitting form:', err);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-[#1E1E1E] p-14 flex flex-col items-center w-[350px] border border-[#ff0000] justify-around gap-8 rounded-2xl relative">
				<button onClick={onClose} className="absolute top-2 right-3 text-white text-xl">✖</button>

				<p className={`${poppins.className} text-center text-2xl font-black m-0`}>
					<span className="text-[#099EB8]">Flix</span><span className="text-[#FD3232]">Hub</span>
				</p>

				<div className="flex w-full flex-col sm:flex-row gap-6">
					<button className={`bg-[#2C2C2C] flex-1 w-full rounded-lg p-2 ${activeTab === "register" ? "border border-[#099EB8]" : ""}`} onClick={() => setActiveTab("register")}> Register </button>
					<button className={`bg-[#2C2C2C] flex-1 w-full rounded-lg p-2 ${activeTab === "login" ? "border border-[#099EB8]" : ""}`} onClick={() => setActiveTab("login")}> Login </button>
				</div>

				{activeTab === "register" ? (
					<form onSubmit={register} className="flex w-full text-left text-[#717171] flex-col items-center justify-center gap-4">
						<div className="w-full">
							<label htmlFor="username">Username</label>
							<input
								id="register-username"
								type="text"
								className="bg-[#151515] w-full h-[33px] rounded-xl mt-2 pl-2"
							/>
						</div>
						<div className="w-full">
							<label htmlFor="userId">User ID</label>
							<input
								id="register-userId"
								type="text"
								className="bg-[#151515] w-full h-[33px] rounded-xl mt-2 pl-2"
							/>
						</div>
						<div className="w-full">
							<label htmlFor="password">Password</label>
							<input
								id="register-password"
								type="password"
								className="bg-[#151515] w-full h-[33px] rounded-xl pl-2 mt-2"
							/>
						</div>
						<button type="submit" className="bg-[#2C2C2C] w-full rounded-lg p-2 border border-[#099EB8] mt-2">SIGN UP!</button>
					</form>
				) : (
					<form onSubmit={login} className="flex w-full text-left text-[#717171] flex-col items-center justify-center gap-4">
						<div className="w-full">
							<label htmlFor="login-userId">User ID</label>
							<input id="login-userId" type="text" className="bg-[#151515] w-full h-[33px] rounded-xl mt-2" />
						</div>
						<div className="w-full">
							<label htmlFor="login-password">Password</label>
							<input id="login-password" type="password" className="bg-[#151515] w-full h-[33px] rounded-xl mt-2" />
						</div>
						<button className="bg-[#2C2C2C] w-full rounded-lg p-2 border border-[#099EB8] mt-2">LOGIN</button>
					</form>
				)}
			</div>
		</div>
	);
}
