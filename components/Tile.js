
import React from "react";
import { Poppins, Inter } from 'next/font/google';
import { useState } from "react";


const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '600'],
	variable: '--font-poppins',
});


export default function Tile({ title, poster, overview, rating }) {
	return (
		<div className="flex gap-4 min-w-[350px] h-[170px] bg-[#2a2a2a] rounded-xl p-4 hover:scale-110 hover:bg-[#3a3a3a] shadow-md hover:shadow-2xl transition-all duration-200 cursor-pointer">

			<img src={`https://image.tmdb.org/t/p/w200${poster}`} className="w-24 object-cover rounded-md" />
			
			<div className="flex flex-col justify-between flex-1 overflow-hidden">
				<div className="flex flex-col overflow-hidden">
					<p className="text-white font-bold text-base mb-1 truncate">{title}</p>
					<p className="text-gray-400 text-xs overflow-hidden text-ellipsis line-clamp-3">{overview}</p>
				</div>
				
				<p className="text-[#E0DC5F] text-xs mt-2">
					{'⭐'.repeat(Math.round(rating / 2))}
				</p>
			</div>
		</div>
	);
}
