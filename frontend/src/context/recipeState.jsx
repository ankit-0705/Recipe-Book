import RecipeContext from "./recipeContext";
import React,{useState, useEffect} from 'react';
import axios from 'axios';

const RecipeState = (props)=>{
    const [profileInfo, setProfileInfo] = useState(null);
    const [recipeInfo, setRecipeInfo] = useState(null);

    const infoGetter = async () =>{
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/profile/getuser');
            setProfileInfo(response.data);
        } catch (error) {
            console.error('Some Error Occured!!');
        }
    };

    const recipeGetter = async () =>{
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/recipe/fetchallrecipe');
            setRecipeInfo(response.data);
        } catch (error) {
            console.error('Some Error Occured!!');
        }
    };

    useEffect(()=>{
        infoGetter();
        recipeGetter();
    },[]);

    return(
        <RecipeContext.Provider value={{profileInfo, infoGetter, recipeInfo, recipeGetter}}>
            {props.children}
        </RecipeContext.Provider>
    )
}

export default RecipeState;