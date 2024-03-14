import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();
// for getting all the reipes
router.get("/", async (req, res) => {
    try {
        const response = await RecipesModel.find();
        // const response = await RecipesModel.find({ isActive : true });
        if (response != "") {
            return res.json({
                status: true,
                message: "Recipes were found.",
                data : response
            });
        } else {
            return res.json({
                status: false,
                message: "No recipes were found."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
// for creating a recipe
router.post("/", verifyToken, async (req, res) => {
    try {
        const recipe = new RecipesModel(req.body);
        const response = await recipe.save();
        if (response) {
            return res.json({
                status: true,
                message: "Recipe created successfully.",
                data : response
            });
        } else {
            return res.json({
                status: false,
                message: "Recipe creation has been failed."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
// for save the recipe
router.put("/", verifyToken, async (req, res) => {
    try {
        const { recipeId, userId } = req.body;
        const recipe = await RecipesModel.findById(recipeId);
        if (recipe) {
            const user = await UserModel.findById(userId);
            user.savedRecipes.push(recipe._id);
            const response = await user.save();
            if (response) {
                return res.json({
                    status: true,
                    message: "Recipe saved successfully.",
                    savedRecipes : user.savedRecipes
                });
            } else {
                return res.json({
                    status: false,
                    message: "Something went wrong.",
                });
            } 
        } else{
            return res.json({
                status: false,
                message: "Recipe not found."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
// for getting saved recipes ids
router.get("/saved-recipes/ids/:userId", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        if (user) {
            return res.json({
                status: true,
                message: "Recipes were found.",
                recipeIds : user.savedRecipes 
            });
        } else {
            return res.json({
                status: false,
                message: "User Not found."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
// for saved recipes
router.get("/saved-recipes/:userId", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const savedRecipes = await RecipesModel.find({
            _id : { $in : user.savedRecipes },
        });
        if (savedRecipes != "") {
            return res.json({
                status: true,
                message: "Saved Recipes were found.",
                savedRecipes : savedRecipes 
            });
        } else {
            return res.json({
                status: false,
                message: "No Recipe found."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
// for getting all the reipes
router.get("/:userId", async (req, res) => {
    // return res.json(req.params.userId)
    try {
        const response = await RecipesModel.find({ userId : req.params.userId });
        // const response = await RecipesModel.find({ isActive : true });
        if (response != "") {
            return res.json({
                status: true,
                message: "Recipes were found.",
                data : response
            });
        } else {
            return res.json({
                status: false,
                message: "No recipes were found."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
// for remove the single recipe
router.post("/remove", verifyToken, async (req, res) => {
    try {
        const { recipeId, userId } = req.body;
        const recipe = await RecipesModel.findById(recipeId);
        if (recipe) {
            const user = await UserModel.findById(userId);
            const savedRecipes = user.savedRecipes;
            const remainingRecipes = savedRecipes.filter((recipe) => recipe != recipeId);
            user.savedRecipes = remainingRecipes;
            const response = await user.save();
            if (response) {
                return res.json({
                    status: true,
                    message: "Recipe removed successfully.",
                    removedRecipe : recipeId
                });
            } else {
                return res.json({
                    status: false,
                    message: "Something went wrong.",
                });
            } 
        } else{
            return res.json({
                status: false,
                message: "Recipe not found."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
// for edit recipe
router.post("/edit", async (req, res) => {
    // return res.json(req.params.userId)
    try {
        const response = await RecipesModel.findById(req.params.recipeId);
        // const response = await RecipesModel.find({ isActive : true });
        if (response != "") {
            return res.json({
                status: true,
                message: "Recipe were found.",
                data : response
            });
        } else {
            return res.json({
                status: false,
                message: "No recipes were found."
            });
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});

export { router as recipesRouter };