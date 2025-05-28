const mongoose = require('mongoose')
const { Schema } = mongoose;

//Ingredient Schema
const ingredientSchema = new Schema({
  name: { type:String, required:true },
  quantity: { type:Number, required:true,min:0 },
  unit: { type:String, required:true }
});

//Recipe Schema
const recipeSchema = new Schema({
  name: { type:String, required:true },
  ingredients: [ingredientSchema],
  steps: [{ type:String, required:true }],
  image:{
    type:{type:String},
    data:{type:Buffer}
  },
  liked:{ type:Boolean, default:false } 
});

module.exports = mongoose.models.recipeInfo || mongoose.model('recipeInfo',recipeSchema)