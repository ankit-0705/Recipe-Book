import React, {useContext} from 'react';
import Navbar from '../components/navbar';
import Card from '../components/card';
import TiltCard from '../components/tiltcard';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import RecipeContext from '../context/recipeContext';

function LandingPage() {
  const {recipeGetter} = useContext(RecipeContext);
  const navigate = useNavigate();

  const handleClick = async ()=>{
    try {
      await recipeGetter();
      navigate('/home');
    } catch (error) {
      console.error('Some Error Occured!!');
    }
  }
  

  return (
    <div className="flex flex-col min-h-screen bg-base-200 text-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-base-200">
        {/* Left Text */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="h-[120px] flex items-center justify-start">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-success">
              <Typewriter
                words={[
                  'Your Personal E‑Recipe Book',
                  'Cook Smarter, Live Better',
                  'All Your Recipes, One Place',
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={85}
                deleteSpeed={60}
                delaySpeed={2000}
              />
            </h1>
          </div>

          <p className="text-white/70 text-lg leading-relaxed">
          Save your favorite recipes, anytime, anywhere.<br />
          Your personal digital cookbook — organized, accessible, and always with you.
          </p>

          <div className="flex space-x-4 mt-4">
              <button className="border border-white py-3 px-6 rounded-lg hover:bg-white hover:text-black transition duration-200" onClick={handleClick}>
                {"Let's Start "}
              </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="w-[85%] max-w-md">
            <TiltCard />
          </div>
        </div>
      </div>

      {/* Section 2 - Watch It Work */}
      <div className="bg-base-200 text-white py-20 px-8 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-2">Your Recipes, Your Way</h2>
        <div className="w-24 h-1 bg-green-500 mx-auto mb-10 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <Card heading="Add Your Recipes" info="Save your favorite dishes in one place" />
        <Card heading="Organize with Ease" info="Categorize and manage your personal cookbook" />
        <Card heading="Cook Anytime" info="Access your recipes whenever you need them" />

        </div>
      </div>
    </div>
  );
}

export default LandingPage;