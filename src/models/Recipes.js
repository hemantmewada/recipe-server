import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
    name : { type : String, required : true },
    ingredients : [{ type : String, required : true }],
    instructions : { type : String, required : true },
    imageUrl : { type : String, required : true },
    cookingTime : { type : Number, required : true },
    isActive : { type : Boolean, required : true },
    userId : { type : mongoose.Schema.Types.ObjectId, ref : "users", required : true }
});

export const RecipesModel = mongoose.model("recipes",RecipeSchema);