import React from "react";
import { useState } from "react";

export default function ProfilePicture({userId, onClick}) {
	return (
		<button onClick={onClick} className="min-w-6">
			<img src={`http://127.0.0.1:5000/uploads/${userId}`} className="w-6 rounded-full"/>
		</button>
	);
}
