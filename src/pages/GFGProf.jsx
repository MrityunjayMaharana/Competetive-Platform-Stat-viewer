import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';


// {
//   "School": 0,
//   "Basic": 10,
//   "Easy": 28,
//   "Medium": 8,
//   "Hard": 0,
//   "userName": "mrityunjay8bd1",
//   "totalProblemsSolved": 46
// }
function GFGProf() {
  const [data, setData] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://geeks-for-geeks-stats-api.vercel.app/?raw=Y&userName=${username}`)
        setData(response.data)
      } catch (error) {
        console.error("Error while fetching data");
      }
    }
    fetchData();
  }, [data])
  return (
    <>
      <div>{username}'s GFG Profile</div>
      <div>
        <span>Basic: {data.Basic}</span>
      </div>
    </>
  )
}

export default GFGProf