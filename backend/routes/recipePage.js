const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Recipe = require('../models/recipeInfo');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔧 Middleware to parse JSON string fields before validation
const parseMultipartJsonFields = (req, res, next) => {
  try {
    if (req.body.ingredients && typeof req.body.ingredients === 'string') {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }
    if (req.body.steps && typeof req.body.steps === 'string') {
      req.body.steps = JSON.parse(req.body.steps);
    }
  } catch (e) {
    return res.status(400).json({ message: 'Invalid JSON format in ingredients or steps' });
  }
  next();
};

// ROUTE 1: Add Recipe
router.post(
  '/addrecipe',
  upload.single('image'),
  parseMultipartJsonFields,
  [
    body('name', 'Enter a valid recipe name').isLength({ min: 3 }),
    body('ingredients', 'Ingredients must be an array').isArray({ min: 1 }),
    body('ingredients.*.name', 'Each ingredient must have a name.').isString().notEmpty(),
    body('ingredients.*.quantity', 'Each ingredient must have a valid quantity.').isNumeric(),
    body('ingredients.*.unit', 'Each ingredient must have a unit.').isString().notEmpty(),
    body('steps', 'Steps must be an array').isArray({ min: 1 }),
    body('steps.*', 'Each step must be at least 5 characters.').isString().isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()); 
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let image = null;
      
      if(req.file){
        image={
          data:req.file.buffer,
          type:req.file.mimetype
        };
      }
      

      await Recipe.create({
        name: req.body.name,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        image:image,
      });

      res.json({ Success: 'Added into the database.' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
  }
);


//ROUTE 2: Fetch All Recipe
router.get('/fetchallrecipe', async (req, res) => {
    try {
      const allRecipes = await Recipe.find();
  
      if (allRecipes.length === 0) {
        return res.status(404).json({ message: "No recipes found in the database." });
      }
      
      // Prepare the response with the image as base64 if it exists
      const recipesWithImage = allRecipes.map(recipe => {
        const recipeObj = recipe.toObject();

        if (recipe.image && recipe.image.data) {
          const base64Image = Buffer.isBuffer(recipe.image.data)
            ? recipe.image.data.toString('base64') 
            : Buffer.from(recipe.image.data.data).toString('base64'); // handles both Buffer and object
  
          recipeObj.image = {
            type: recipe.image.type,
            data: base64Image
          };
        } else {
          recipeObj.image = null;
        }
  
        return recipeObj;
      });
  
      res.json(recipesWithImage);

  
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error." });
    }
  });
  

//ROUTE 3: Update Recipe
router.put('/updaterecipe/:id', upload.single('image'), async (req, res) => {
  const { name, ingredients, steps } = req.body;
  const newRecipe = {};

  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "No recipe found in the database." });
    }

    // Basic fields
    if (name) newRecipe.name = name;
    if (ingredients) newRecipe.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    if (steps) newRecipe.steps = typeof steps === 'string' ? JSON.parse(steps) : steps;

    // Handle image update
    if(req.file){
      newRecipe.image={
        data:req.file.buffer,
        type:req.file.mimetype
      }
    }

    // Update recipe
    recipe = await Recipe.findByIdAndUpdate(req.params.id, { $set: newRecipe }, { new: true });
    res.json({ Success: "Recipe Updated Successfully.", updatedRecipe: recipe });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

//ROUTE 4: Delete Recipe
router.delete('/deleterecipe/:id',async (req,res)=>{
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if(!recipe){
            return res.status(404).json({message:"No recipe found in the database."});
        }
        res.json({ message: "Recipe Deleted Successfully.", deletedRecipe: recipe });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error."})
    }
});

//ROUTE 5: Like/Dislike Recipe
router.post('/like/:id',async (req,res)=>{
    try {
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return res.status(404).json({message:"No recipe found in the database."});
        }
        recipe.liked = !recipe.liked;
        await recipe.save();
        if(recipe.liked===true){
            res.json({Success:"Liked Successfully."});
        }else{
            res.json({Success:"Disliked Successfully."});
        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message:"Internal Server Error."})
    }
});


//ROUTE 6: Search Recipe
router.get('/searchrecipe', async (req, res) => {
    const query = req.query.query;
  
    try {
      const recipes = await Recipe.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { 'ingredients.name': { $regex: query, $options: 'i' } }
        ]
      });
  
      if (recipes.length === 0) {
        return res.status(404).json({ message: 'No recipes matched your search.' });
      }

      // Prepare the response with the image as base64 if it exists
      const recipesWithImage = recipes.map(recipe => {
        const recipeObj = recipe.toObject();
        if (recipe.image && recipe.image.data) {
          recipeObj.image = `data:${recipe.image.type};base64,${recipe.image.data.toString('base64')}`;
        } else {
          recipeObj.image = null;
        }
        return recipeObj;
      });
  
      res.json(recipesWithImage);
  
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error." });
    }
  });

module.exports = router