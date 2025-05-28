import React, { useContext, useEffect, useState } from 'react';
import RecipeContext from '../context/recipeContext';
import axios from 'axios';
import Buttons from '../components/buttons';

function ProfilePage() {
  const { profileInfo, infoGetter, recipeInfo } = useContext(RecipeContext);
  const [totalDishes, setTotalDishes] = useState(0);
  const [likedDishes, setLikedDishes] = useState(0);
  const [editInfo, setEditInfo] = useState({
    name: '',
    email: '',
    pnum: '',
    location: '',
  });

  const handleClick = () => {
    setEditInfo({
      name: profileInfo ?.name || '',
      email: profileInfo ?.email || '',
      pnum: profileInfo ?.pnum || '',
      location: profileInfo ?.location || '',
    });
    document.getElementById('my_modal_1').showModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://127.0.0.1:5000/api/profile/updateuser', editInfo);
      await infoGetter();
      document.getElementById('my_modal_1').close();
    } catch (error) {
      console.error(`Some Error Occurred!!`, error);
    }
  };

  useEffect(() => {
  if (Array.isArray(recipeInfo)) {
    setTotalDishes(recipeInfo.length);
    const likedCount = recipeInfo.filter(recipe => recipe.liked === true).length;
    setLikedDishes(likedCount);
  } else {
    setTotalDishes(0);
    setLikedDishes(0);
  }
}, [recipeInfo]);


  return (
    <div className="flex h-screen bg-base-200 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0f0f]/35 p-6 hidden lg:flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center">
            <img
              src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled"
              className="w-20 h-20 rounded-full border-2 border-green-500"
              alt="profile"
            />
            <h2 className="mt-4 font-semibold">{profileInfo ?.name || 'Loading.....'}</h2>
          </div>

          <nav className="mt-10 space-y-4">
            <Buttons/>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 pt-6 max-w-5xl mx-auto">
          {/* Banner */}
          <div className="w-full relative">
            <img
              src="https://thumbs.dreamstime.com/b/abstract-food-background-top-view-dark-rustic-kitchen-table-wooden-cutting-board-cooking-spoon-frame-banner-137304354.jpg"
              alt="Banner"
              className="w-full h-48 object-cover rounded-lg"
            />

            {/* Profile Image */}
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
              <img
                src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled"
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-black shadow-lg"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-20 w-full px-4">
            {/* Centered Name */}
            <h1 className="text-3xl font-bold text-center text-white">
              {profileInfo ?.name || 'Loading...'}
            </h1>

            {/* Stats Section */}
            {Array.isArray(recipeInfo) && recipeInfo.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-6 text-center">
                <div className="w-60 px-6 py-4 rounded-xl bg-base-100 border-base-300 bg-opacity-30 hover:shadow-md hover:shadow-green-500/50 transition-shadow duration-300">
                  <h2 className="text-lg font-semibold text-green-400">Total Dishes</h2>
                  <p className="text-white text-xl font-bold">{totalDishes}</p>
                </div>
                <div className="w-60 px-6 py-4 rounded-xl bg-base-100 border-base-300 bg-opacity-30 hover:shadow-md hover:shadow-green-500/50 transition-shadow duration-300">
                  <h2 className="text-lg font-semibold text-green-400">Liked Dishes</h2>
                  <p className="text-white text-xl font-bold">{likedDishes}</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-gray-400">
                <p className="text-lg">You haven't added any recipes yet.</p>
              </div>
            )}
            
            {/* Remaining Info Header & Edit Button */}
            <div className="mt-10 w-full max-w-3xl mx-auto flex justify-between items-center">
              <h2 className="text-white text-lg font-semibold">Remaining Info:</h2>
              <button
                onClick={handleClick}
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                </svg>
                Edit
              </button>
              {/* Modal */}
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-base-100 text-white flex flex-col justify-center items-center w-full max-w-md">
                  <h3 className="font-bold text-lg text-center text-green-500 mb-4">Edit Profile Info</h3>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    {/* Name */}
                    <input
                      type="text"
                      name="name"
                      value={editInfo.name}
                      onChange={handleChange}
                      required
                      placeholder="Username"
                      pattern="[A-Za-z][A-Za-z0-9\s\-]*"
                      minLength="3"
                      maxLength="30"
                      className="input input-bordered w-full"
                    />
                    {/* Email */}
                    <input
                      type="email"
                      name="email"
                      value={editInfo.email}
                      onChange={handleChange}
                      placeholder="mail@site.com"
                      required
                      className="input input-bordered w-full"
                    />
                    {/* Phone */}
                    <input
                      type="tel"
                      name="pnum"
                      value={editInfo.pnum}
                      onChange={handleChange}
                      placeholder="Phone"
                      pattern="[0-9]*"
                      minLength="10"
                      maxLength="10"
                      required
                      className="input input-bordered w-full"
                    />
                    {/* Location */}
                    <input
                      type="text"
                      name="location"
                      value={editInfo.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      pattern="[A-Za-z\s,]{2,50}"
                      required
                      className="input input-bordered w-full"
                    />

                    {/* Buttons aligned to opposite sides */}
                    <div className="modal-action flex justify-between w-full mt-2">
                      <button type="submit" className="btn btn-success text-white">Save</button>
                      <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Cancel</button>
                    </div>
                  </form>
                </div>
              </dialog>

            </div>

            {/* Remaining Info Collapse */}
            <div className="mt-2 collapse bg-base-100 border border-base-300 rounded transition-all duration-300 hover:shadow-md hover:shadow-green-500/40">
              <input type="checkbox" />
              <div className="collapse-title font-semibold text-white text-base">
                Click to view more info
              </div>
              <div className="collapse-content text-base text-white flex flex-col gap-6 pl-2 sm:pl-4">
                <p className="text-lg">
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-300 ml-4">{profileInfo ?.email || 'Loading...'}</span>
                </p>
                <p className="text-lg">
                  <span className="font-medium">Phone Number:</span>
                  <span className="text-gray-300 ml-4">{profileInfo ?.pnum || 'Loading...'}</span>
                </p>
                <p className="text-lg">
                  <span className="font-medium">Location:</span>
                  <span className="text-gray-300 ml-4">{profileInfo ?.location || 'Loading...'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
