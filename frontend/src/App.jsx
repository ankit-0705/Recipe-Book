import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import LandingPage from './routes/landingPage';
import HomePage from "./routes/homePage";
import ProfilePage from "./routes/profilePage";
import LikedPage from "./routes/likedPage";
import RegisterPage from "./routes/registerPage";
import RecipeState from "./context/recipeState";

function App() {

  return (
    <>
    <RecipeState>
      <Router>
        <Routes>
          <Route exact path='/' element={<RegisterPage/>} />
          <Route exact path='/landing' element={<LandingPage />} />
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/liked' element={<LikedPage/>}/>
        </Routes>
      </Router>
    </RecipeState>
    </>
  )
}

export default App
