import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Details() {
    const [username, setUsername] = useState("");
    const [extractedUsername, setExtractedUsername] = useState("");
    const [platform, setPlatform] = useState("leetcode");
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate(`/profile/${platform}/${extractedUsername || username}`);
    };

    const handleChange = (event) => {
        const inputValue = event.target.value;
        setUsername(inputValue);
        const urlPatterns = {
            leetcode: /https:\/\/leetcode\.com\/u\/([a-zA-Z0-9_-]+)/,
            gfg: /https:\/\/www\.geeksforgeeks\.org\/user\/([a-zA-Z0-9_-]+)\//,
            codechef: /https:\/\/www\.codechef\.com\/users\/([a-zA-Z0-9_-]+)/
        };
        const match = inputValue.match(urlPatterns[platform]);
        if (match) {
            setExtractedUsername(match[1]);
        } else {
            setExtractedUsername("");
        }
    };

    const handlePlatformChange = (event) => {
        setPlatform(event.target.value.toLowerCase());
        setExtractedUsername("");
        setUsername("");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className='border-[1px] p-[25px] rounded-xl border-gray-400'>
                <h1 className='text-2xl font-bold mb-4'>View your { platform.charAt(0).toUpperCase() + platform.slice(1) } Profile</h1>
                <hr />
                <div className="flex space-x-4 mt-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="platform" className="block mb-2">Select Platform: </label>
                        <select
                            name="platform"
                            value={platform}
                            onChange={handlePlatformChange}
                            className="rounded-md px-2 py-1 border border-gray-600 bg-gray-800 text-white w-full"
                        >
                            <option value="leetcode">Leetcode</option>
                            <option value="gfg">Geeks for Geeks</option>
                            <option value="codechef">CodeChef</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label htmlFor="usrname" className="block mb-2">{ platform.charAt(0).toUpperCase() + platform.slice(1) } Profile Id: </label>
                        <input
                            onChange={handleChange}
                            name="usrname"
                            type="text"
                            value={username}
                            placeholder="id / profile link"
                            className="rounded-md px-2 py-1 border border-gray-600 bg-gray-800 text-white w-full"
                        />
                    </div>
                </div>
                <button 
                    onClick={handleClick} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200"
                >
                    Show Profile
                </button>

                {username && <p className="mt-4">Username: {extractedUsername || username}</p>}
            </div>
        </div>
    );
}

export default Details;