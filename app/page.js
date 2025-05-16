'use client';

import Image from "next/image";

import { Poppins, Inter } from 'next/font/google';
import { useEffect, useState } from "react";

import Tile from "@/components/Tile";
import AddedPopup from "@/components/AddedPopup";
import ProfilePopup from "@/components/ProfilePopup";
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

export default function Main() {

	const [movieDetails, setMovieDetails] = useState(null);
	const [comments, setComments] = useState(null);
	const [SuggestedMovies, setSuggestedMovies] = useState(null);
	const [TrendingMovies, setTrendingMovies] = useState(null);
	const [categories, setCategories] = useState(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const [profileId, setProfileId] = useState(null);
	const [watchlist, setWatchlist] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [filters, setFilters] = useState([]);

	const setProfile = (id) => {
		setProfileId(id);
		setShowProfile(true);
	};

	const toggleFilter = (filter) => {
		if (filters.includes(filter)) {
			setFilters(filters.filter(f => f !== filter));
		} else {
			setFilters([...filters, filter]);
		}
		search();
	}

	const isFilterActive = (filter) => {
		return filters.includes(filter);
	}

	const search = async () => {
		const query = document.getElementById('search').value;

		if (!query) return;

		try {
			const res = await fetch(`http://127.0.0.1:5000/search?q=${query}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ filters }),
			});
			setSearchResults(await res.json());
			
		} catch (err) {
			console.error('Search failed:', err);
		}
	};

	const getMovieDetails = async () => {
		try {
			if (!searchResults?.results || searchResults.results.length === 0) return;
			const id = searchResults?.results[0].id;
			if (!id) return;
			const res = await fetch(`http://127.0.0.1:5000/moviedata?q=${id}`);
			setMovieDetails(await res.json());
		} catch (err) {
			console.error('fetch movie details failed:', err);
		}
	};

	const getComments = async () => {
		try {
			const id = searchResults?.results[0].id;
			console.log("ID:", id);
			if (!id) return;
			const res = await fetch(`http://127.0.0.1:5000/comments?movieId=${id}`);
			
			setComments(await res.json());
			console.log("Response:", comments);
		} catch (err) {
			console.error('fetch comments failed:', err);
		}
	}

	const fetchWatchlist = async () => {
		try {
			const res = await fetch('http://127.0.0.1:5000/watchlist', {
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
			console.log("Watchlist:", data);
			setWatchlist(data);
		} catch (err) {
			console.error('Error on fetching watch later movies', err);
		}
	};

	const isMovieInWatchlist = (id) => {
		if (!watchlist) return false;
		for (let i = 0; i < watchlist.length; i++) {
			if (watchlist[i].id === id) {
				return true;
			}
		}
		return false;
	}

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		const comment = document.getElementById("comment-box").value;
		const id = searchResults?.results[0].id;
		console.log("ID:", id);
		if (!id) return;
		if (!comment) return;

		try {
			const res = await fetch(`http://127.0.0.1:5000/comments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({movieId: id, text: comment}),
				credentials: 'include'
			});
			console.log("Response:", res);
			const msg = await res.text();
			console.log("Server response:", msg);
			document.getElementById("comment-box").value = "";
		} catch (err) {
			console.error('Submit comment failed:', err);
		}
	}

	const getSuggestedMovies = async () => {
		try {
			const id = searchResults?.results[0].id;
			if (!id) return;
			const res = await fetch(`http://127.0.0.1:5000/discover/${id}`);
			setSuggestedMovies(await res.json());
		} catch (err) {
			console.error('fetch movie details failed:', err);
		}
	};

	const getTrendingMovies = async () => {
		try {
			const id = searchResults?.results[0].id;
			if (!id) return;
			const res = await fetch(`http://127.0.0.1:5000/trending`);
			setTrendingMovies(await res.json());
		} catch (err) {
			console.error('fetch movie details failed:', err);
		}
	};

	const getCategories = async () => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/genres`);
			const data = await res.json();
			setCategories(data);
		} catch (err) {
			console.error('fetch movie details failed:', err);
		}
	};

	const addToWatchlist = async (id) => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/watchlist?movieId=${movieDetails?.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			if (res.status === 201) {
				setShowPrompt(true);
			} else {
				console.error('Error adding movie to watch later.', res.status);
			}
		} catch (err) {
			console.error('Error on adding movie to watch later', err);
		}
	};

	const addToHistory = async (id) => {
		try {
			const res = await fetch(`http://127.0.0.1:5000/history?movieId=${movieDetails?.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});
			if (res.status !== 201) {
				console.error('Error adding movie to history.', res.status);
			}
		} catch (err) {
			console.error('Error on adding movie to history', err);
		}
	};

	const noResults = () => {
		if(searchResults) {
			if (searchResults?.results && searchResults.results) {
				return null;
			}
		}
		return <div className="flex flex-col gap-4 items-center justify-center h-full">
			<p className="text-[#ffffff] font-bold text-lg">No results found</p>
			<p className="text-[#ffffff] font-bold text-lg">Try searching for something else</p>
		</div>;
		
	}

	useEffect(() => {
		if (searchResults?.results && searchResults.results.length > 0) {
			fetchWatchlist();
			getMovieDetails();
			getComments();
			getSuggestedMovies();
			getTrendingMovies();
			getCategories();
		}
	}, [searchResults]);

	useEffect(() => {
		document.getElementById('search').value = "deadpool";
		document.getElementById('search').addEventListener('keyup', (e) => {
			if (e.key === 'Enter') {
				search();
			}
		});
		search();
	}, []);

	  
	return (
		<div className="flex flex-col gap-4 px-2">
			
			{categories && (
				<div className="flex gap-4 overflow-x-scroll items-center p-2">
					{categories.map((category, index) => (
						isFilterActive(category.id) && (
						<a key={index} className="flex gap-4 bg-[#3a3a3a] cursor-pointer rounded-xl px-4 py-2 whitespace-nowrap" onClick={()=>toggleFilter(category.id)}>{category.name}</a>
						)
					))}
					{categories.map((category, index) => (
						!isFilterActive(category.id) && (
						<a	key={index}
							className="flex gap-4 bg-[#2a2a2a] rounded-xl px-4 cursor-pointer py-2 whitespace-nowrap hover:bg-[#3a3a3a] transition-all hover:scale-105"
							onClick={()=>toggleFilter(category.id)}>
							{category.name}
						</a>
						)
					))}
				</div>
			)}

			{noResults()}
			
			{searchResults && (
				<div className="flex w-full gap-4 items-stretch justify-center flex-wrap lg:flex-nowrap">
					
					<div className="flex gap-2 flex-col justify-center sm:hidden">
						<img src={`https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`} className="rounded-xl w-full "/>
						<div className="flex flex-wrap gap-2 w-full font-semibold justify-center">
							<button className="bg-[#FF0000] py-2 px-4 rounded-lg flex-1 cursor-pointer" onClick={addToHistory}>Watch</button>
							<button className="bg-[#242424] py-2 px-4 rounded-lg" onClick={addToWatchlist}>
								<img src="Plus.svg" className="inline-block w-4 h-4" />
							</button>
						</div>
					</div>

					<div className="justify-between relative p-6 text-white flex flex-col sm:hidden m-auto w-full gap-4">
						
						<div className="flex flex-col gap-4 w-full text-sm text-gray-300 mb-2">
							<div className="flex justify-between">
								<h1 className="text-2xl font-black sm:text-4xl">{searchResults?.results[0]?.title}</h1>
							</div>
							<div className="flex justify-between">
							<p>{searchResults?.results[0]?.release_date?.slice(0, 4)}</p>

								<p className="text-[#E0DC5F]">{movieDetails?.vote_average}/10</p>
							</div>
							<p className="mb-4 text-xs text-gray-300 max-w-xl lg:hidden sm:text-sm"> {movieDetails?.overview} </p>
						</div>
					</div>

					<div className="flex gap-8 justify-around items-stretch lg:flex-row w-full flex-col">
					{/* <div className="flex gap-8 justify-around w-full flex-wrap"> */}

						<div className="relative h-100 rounded-xl hidden sm:flex flex-3/4">
							<img src={`https://image.tmdb.org/t/p/original${movieDetails?.backdrop_path}`} className=" object-cover w-full rounded-xl"/>

							<div className="absolute rounded-xl inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

							<div className="absolute inset-0 flex w-fit flex-col justify-end p-6 text-white z-10">
								<div className="flex flex-col gap-4 text-sm text-gray-300 mb-2">
									<h1 className="text-4xl font-black">{searchResults?.results[0]?.title}</h1>
									<div className="flex justify-between">
										<p>{searchResults?.results[0]?.release_date?.slice(0, 4)}</p>
										<p className="text-[#E0DC5F]">{movieDetails?.vote_average}/10</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button className="bg-[#FF0000] py-2 px-4 flex-1 rounded-lg hover:scale-110 duration-100 cursor-pointer" onClick={addToHistory}>Watch</button>
									{!isMovieInWatchlist(movieDetails?.id) && (
										<button className="bg-[#080808] py-2 p-4 rounded-lg hover:bg-gray-700 hover:scale-110 duration-100" onClick={addToWatchlist}>
											<img src="Plus.svg" className="inline-block w-4 h-4" />
										</button>
									)}
								</div>
							</div>
						</div>
						{comments && (
							<div className="bg-[#151515] h-100 rounded-xl flex flex-col flex-1/4 sm:max-h-full max-h-80">
								<h4 className="bg-[#1A1A1A] rounded-xl p-4 text-[#ffffff] font-bold text-base sm:text-lg">Comments</h4>
								<div className="flex overflow-y-auto flex-col justify-between">
									<div className=" overflow-y-auto p-4 flex flex-col gap-4">
										{comments?.map((comment) => (
										<div key={comment.id} className="flex gap-3 justify-between items-start">
											<div className="flex gap-3 items-start sm:text-sm text-white text-xs">
												<ProfilePicture userId={comment.userId} onClick={() => setProfile(comment.userId)}/>
												<div>
													<p className="font-bold">{comment.name}</p>
													<p className="break-words">{comment.text}</p>
												</div>
											</div>
											<div className="flex flex-col items-center justify-start text-gray-400 text-sm min-w-[40px]">
												<img src="like.svg" className="w-4 h-4" />
												<p>{comment.likes}</p>
											</div>
										</div>
										))}
									</div>
									
									<form onSubmit={handleCommentSubmit} className="px-4 min-w-fit pb-4">
										<input
											type="text"
											id="comment-box"
											className="w-full h-10 bg-[#2A2A2A] rounded-xl p-4 text-sm text-white placeholder:text-gray-400"
											placeholder="Add a comment..."
										/>
									</form>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			<div className="overflow-x-hidden relative px-4 pb-10 gap-4 flex flex-col font-bold text-xl text-[#ffffff]">
				<div>
					<h4>Similar</h4>
					<div className="flex gap-4 overflow-x-auto p-2 overflow-y-visible items-center">
						{ searchResults?.results.map((poster) => (
							(poster.poster_path && (
								<Tile key={poster.id} title={poster.title} poster={poster.poster_path} overview={poster.overview} rating={poster.vote_average}/>
							))
						))}
					</div>
				</div>

				<div>
					<h4>Suggested</h4>
					<div className="flex gap-4 overflow-x-auto p-2 overflow-y-visible items-center">
						{ SuggestedMovies?.map((poster) => (
							(poster.poster_path && (
								<Tile key={poster.id} title={poster.title} poster={poster.poster_path} overview={poster.overview} rating={poster.vote_average}/>
							))
						))}
					</div>
				</div>

				<div>
					<h4>Trending</h4>
					<div className="flex gap-4 overflow-x-auto p-2 overflow-y-visible items-center">
						{TrendingMovies?.results.map((poster) => (
							(poster.poster_path && (
								<Tile key={poster.id} title={poster.title} poster={poster.poster_path} overview={poster.overview} rating={poster.vote_average}/>
							))
						))}
					</div>
				</div>

				<h4 className="text-[#ffffff] overflow-x-scroll font-bold text-lg">Discover</h4>
				<div className="flex gap-4 overflow-x-scroll h-40">
					<img src="movie1.png" className="rounded-xl"/>
					<img src="movie2.png" className="rounded-xl"/>
					<img src="movie3.png" className="rounded-xl"/>
					<img src="movie4.png" className="rounded-xl"/>
					<img src="movie1.png" className="rounded-xl"/>
					<img src="movie2.png" className="rounded-xl"/>
					<img src="movie3.png" className="rounded-xl"/>
					<img src="movie4.png" className="rounded-xl"/>
					<img src="movie1.png" className="rounded-xl"/>
					<img src="movie2.png" className="rounded-xl"/>
					<img src="movie3.png" className="rounded-xl"/>
					<img src="movie4.png" className="rounded-xl"/>
					<img src="movie1.png" className="rounded-xl"/>
					<img src="movie2.png" className="rounded-xl"/>
					<img src="movie3.png" className="rounded-xl"/>
					<img src="movie4.png" className="rounded-xl"/>
				</div>
			</div>

			<AddedPopup isOpen={showPrompt} prompt={`${movieDetails?.Tile} has been added to your watchlist`} onClose={() => setShowPrompt(false)}/>
			<ProfilePopup userId={profileId} isOpen={showProfile} onClose={() => setShowProfile(false)}/>
		</div>
	);
}