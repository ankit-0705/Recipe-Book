import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import RecipeContext from '../context/recipeContext';

function Buttons() {
  const [userLocation, setUserLocation] = useState(null);
  const {recipeGetter} = useContext(RecipeContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    setUserLocation(location.pathname);
  },[location]);

  return (
    <>
        <button onClick={()=>{navigate('/landing')}} className="w-full border border-white py-2 rounded-md">Home</button>
        <button onClick={()=>{navigate('/profile')}} className={`w-full ${userLocation==='/profile'?"bg-green-500":"border border-white"} py-2 rounded-md`}>Profile</button>
        <button onClick={async ()=>{navigate('/home'),await recipeGetter()}} className={`w-full ${userLocation==='/home'?"bg-green-500":"border border-white"} py-2 rounded-md`}>Recipes</button>
        <button onClick={()=>{navigate('/liked')}} className={`w-full ${userLocation==='/liked'?"bg-green-500":"border border-white"} py-2 rounded-md`}>About Us</button>
    </>
  )
}

export default Buttons
