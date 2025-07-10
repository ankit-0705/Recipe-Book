import React, { useContext, useRef, useState, useEffect } from 'react';
import RecipeContext from '../context/recipeContext';
import Buttons from '../components/buttons';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
  const { profileInfo, recipeInfo, recipeGetter } = useContext(RecipeContext);
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null); // recipe currently being edited



  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState(['']);
  const [imageFile, setImageFile] = useState(null);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons);
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [recipeInfo]);

  const scrollByAmount = (amount) => {
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleClick = () => {
    document.getElementById('my_modal_1').showModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('ingredients', JSON.stringify(ingredients.filter(i => i.name && i.quantity)));
    formData.append('steps', JSON.stringify(steps.filter(step => step.trim() !== '')));
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await axios.post(`${backendUrl}/api/recipe/addrecipe`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 200 || res.status === 201) {
        alert('Recipe added successfully!');
        setIngredients([{ name: '', quantity: '', unit: '' }]);
        setSteps(['']);
        setImageFile(null);
        document.getElementById('my_modal_1').close();
        recipeGetter();
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        alert(`Validation error:\n${err.response.data.errors.map(e => `• ${e.msg}`).join('\n')}`);
      } else {
        alert('Failed to add recipe');
      }
    }
  };

  const handleLike = async (recipeId) => {
    try {
      setIsLiking(true);
      const res = await axios.post(`${backendUrl}/api/recipe/like/${recipeId}`);
      if (res.status === 200) {
        recipeGetter();
        if (selectedRecipe && selectedRecipe._id === recipeId) {
          setSelectedRecipe({ ...selectedRecipe, liked: !selectedRecipe.liked });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (recipeId) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/recipe/deleterecipe/${recipeId}`);
    if (res.status === 200) {
      alert("Recipe deleted successfully.");
      setSelectedRecipe(null);
      document.getElementById('view_recipe_modal').close();
      recipeGetter();
    }
    }  catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete the recipe.");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null); // reset to show all if search bar is cleared
      return;
    }
  
    try {
      const res = await axios.get(`${backendUrl}/api/recipe/searchrecipe?query=${encodeURIComponent(searchQuery)}`);
      if (res.status === 200) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error('Search failed:', err);
      alert('No matching recipes found.');
      setSearchResults([]); // set empty so UI knows it's a "no result" state
    }
  };
  

  return (
    <div className="flex min-h-screen bg-black/40 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0f0f] p-6 hidden lg:flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center">
            <img
              src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled"
              className="w-20 h-20 rounded-full border-2 border-green-500"
              alt="profile"
            />
            <h2 className="mt-4 font-semibold">{profileInfo?.name || 'Loading....'}</h2>
          </div>
          <nav className="mt-10 space-y-4"><Buttons /></nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="relative w-full md:w-[450px] flex items-center gap-3">
          <input
            type="text"
            placeholder="Search recipes..."
            className="input w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button className="btn bg-green-600 mt-2" onClick={handleSearch}>Search</button>

          {searchResults && (
            <button className="btn btn-sm ml-2" onClick={() => {
              setSearchResults(null);
              setSearchQuery('');
            }}>Clear Search</button>
          )}

          </div>
          <div className="dropdown dropdown-left">
            <label tabIndex={0} className="btn m-1">Menu</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-white">
              <li><button onClick={()=>setFilterType('all')}>All Recipes</button></li>
              <li><button onClick={()=>setFilterType('liked')}>Liked Recipes</button></li>
            </ul>
          </div>
        </div>

        {/* Add Recipe Section */}
        <div className="flex justify-between items-center mt-10 mb-4 flex-wrap gap-4">
          <h1 className="text-3xl font-semibold">Learn, Cook, & Eat your food</h1>
          <button className="btn bg-green-600" onClick={handleClick}>Add Recipe</button>

          {/* Add Recipe Modal */}
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box text-white bg-base-100">
              <h3 className="font-bold text-lg text-green-500 mb-4 text-center">Add New Recipe</h3>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="text" name="name" required placeholder="Recipe Name" className="input input-bordered w-full" />

                <div>
                  <label className="block mb-2 font-medium">Ingredients:</label>
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" placeholder="Name" className="input input-bordered" value={ing.name} onChange={e => {
                        const temp = [...ingredients];
                        temp[idx].name = e.target.value;
                        setIngredients(temp);
                      }} />
                      <input type="number" placeholder="Qty" className="input input-bordered w-20" value={ing.quantity} onChange={e => {
                        const temp = [...ingredients];
                        temp[idx].quantity = e.target.value;
                        setIngredients(temp);
                      }} />
                      <input type="text" placeholder="Unit" className="input input-bordered w-20" value={ing.unit} onChange={e => {
                        const temp = [...ingredients];
                        temp[idx].unit = e.target.value;
                        setIngredients(temp);
                      }} />
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline btn-sm mt-2" onClick={() => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }])}>+ Add Ingredient</button>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Steps:</label>
                  {steps.map((step, idx) => (
                    <input key={idx} type="text" placeholder={`Step ${idx + 1}`} className="input input-bordered w-full mb-2" value={step} onChange={e => {
                      const temp = [...steps];
                      temp[idx] = e.target.value;
                      setSteps(temp);
                    }} />
                  ))}
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setSteps([...steps, ''])}>+ Add Step</button>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold">Upload Image:</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="file-input file-input-bordered w-full"
                  />
                </div>

                <div className="modal-action">
                  <button type="submit" className="btn btn-success">Save</button>
                  <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Cancel</button>
                </div>
              </form>
            </div>
          </dialog>

          {/* Udpate Recipe Modal */}
          <dialog id="update_recipe_modal" className="modal">
            <div className="modal-box text-white bg-base-100">
              <h3 className="font-bold text-lg text-green-500 mb-4 text-center">Update Recipe</h3>
              {editingRecipe && (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append('name', e.target.name.value);
                    formData.append('ingredients', JSON.stringify(ingredients));
                    formData.append('steps', JSON.stringify(steps));
                    if (imageFile) formData.append('image', imageFile);

                    try {
                      const res = await axios.put(
                        `${backendUrl}/api/recipe/updaterecipe/${editingRecipe._id}`,
                        formData,
                        {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        }
                      );
                      if (res.status === 200) {
                        alert('Recipe updated successfully!');
                        recipeGetter(); // refresh recipes
                        document.getElementById('update_recipe_modal').close();
                        setEditingRecipe(null);
                      }
                    } catch (err) {
                      console.error('Update failed:', err);
                      alert('Failed to update recipe.');
                    }
                  }}
                >
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Recipe Name"
                    className="input input-bordered w-full"
                    defaultValue={editingRecipe.name}
                  />

                  {/* Ingredients */}
                  <div>
                    <label className="block mb-2 font-medium">Ingredients:</label>
                    {ingredients.map((ing, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Name"
                          className="input input-bordered"
                          value={ing.name}
                          onChange={(e) => {
                            const temp = [...ingredients];
                            temp[idx].name = e.target.value;
                            setIngredients(temp);
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          className="input input-bordered w-20"
                          value={ing.quantity}
                          onChange={(e) => {
                            const temp = [...ingredients];
                            temp[idx].quantity = e.target.value;
                            setIngredients(temp);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Unit"
                          className="input input-bordered w-20"
                          value={ing.unit}
                          onChange={(e) => {
                            const temp = [...ingredients];
                            temp[idx].unit = e.target.value;
                            setIngredients(temp);
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm mt-2"
                      onClick={() =>
                        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }])
                      }
                    >
                      + Add Ingredient
                    </button>
                  </div>

                  {/* Steps */}
                  <div>
                    <label className="block mb-2 font-medium">Steps:</label>
                    {steps.map((step, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Step ${idx + 1}`}
                        className="input input-bordered w-full mb-2"
                        value={step}
                        onChange={(e) => {
                          const temp = [...steps];
                          temp[idx] = e.target.value;
                          setSteps(temp);
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setSteps([...steps, ''])}
                    >
                      + Add Step
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold">Update Image (optional):</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="file-input file-input-bordered w-full"
                    />
                  </div>

                  <div className="modal-action">
                    <button type="submit" className="btn btn-success">
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => document.getElementById('update_recipe_modal').close()}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </dialog>

        </div>

        <h2 className="text-xl mb-5 text-green-400">
          {filterType === 'all' ? 'Displaying : All Recipes' : 'Displaying : Liked Recipes'}
        </h2>

        {/* Scrollable Recipes */}
        <div className="relative">
          {canScrollLeft && <button onClick={() => scrollByAmount(-300)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black">&#8592;</button>}
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-10 scroll-smooth">
            {!recipeInfo ? (<p>Loading Recipes.....</p>) : (
              (searchResults??recipeInfo).filter(recipe=>filterType==='all'||recipe.liked).map((recipe, index) => (
                <div
                  key={index}
                  className="min-w-[250px] bg-base-200 text-green-400 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setTimeout(() => {
                      document.getElementById('view_recipe_modal').showModal();
                    }, 0);
                  }}
                >
                  <img
                    src={
                      typeof recipe.image === 'string'
                        ? recipe.image
                        : recipe.image?.data
                        ? `data:${recipe.image.type};base64,${recipe.image.data}`
                        : '/placeholder.jpg'
                    }
                    alt={recipe.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{recipe.name}</h3>
                    <button
                      className="text-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(recipe._id);
                      }}
                    >
                      {recipe.liked ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {canScrollRight && <button onClick={() => scrollByAmount(300)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white px-3 py-2 rounded-full hover:bg-black">&#8594;</button>}
        </div>

        {/* View Recipe Modal */}
        {selectedRecipe && (
          <dialog id="view_recipe_modal" className="modal modal-open">
            <div className="modal-box bg-base-100 text-white max-w-2xl">
              <h3 className="font-bold text-2xl mb-4 text-green-500 flex justify-between items-center">
                {selectedRecipe.name}
                <div className="flex gap-3 text-white text-lg">
                  <button onClick={() => handleLike(selectedRecipe._id)}>{selectedRecipe.liked ? '❤️' : '🤍'}</button>
                  <button
                    onClick={() => {
                      setEditingRecipe(selectedRecipe);
                      setIngredients(selectedRecipe.ingredients);
                      setSteps(selectedRecipe.steps);
                      setImageFile(null); // reset image
                      document.getElementById('view_recipe_modal').close();
                      setTimeout(() => {
                        document.getElementById('update_recipe_modal').showModal();
                      }, 100);
                    }}
                  >
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(selectedRecipe._id)} disabled={isDeleting}>{isDeleting?'Deleting...':'🗑️'}</button>
                </div>
              </h3>
              <img
                src={selectedRecipe.image ? `data:${selectedRecipe.image.type};base64,${selectedRecipe.image.data}` : '/placeholder.jpg'}
                alt={selectedRecipe.name}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Ingredients:</h4>
                <ul className="list-disc list-inside text-gray-300">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing.name} - {ing.quantity} {ing.unit}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Steps:</h4>
                <ol className="list-decimal list-inside text-gray-300">
                  {selectedRecipe.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="modal-action">
                <button className="btn" onClick={() => {
                  setSelectedRecipe(null);
                  document.getElementById('view_recipe_modal').close();
                }}>Close</button>
              </div>
            </div>
          </dialog>
        )}

        {/* Tips Section */}
        <div className="mt-10 p-6 bg-base-200 rounded-lg">
          <h2 className="text-2xl font-semibold text-green-500">Recipe Tips</h2>
          <ul className="list-disc pl-5 mt-4 text-white">
            <li>Always measure your ingredients accurately.</li>
            <li>Don't skip any steps for the best results.</li>
            <li>Use fresh ingredients for the best taste.</li>
            <li>Ensure the recipe is followed carefully to avoid mistakes.</li>
            <li>Keep experimenting and have fun!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
