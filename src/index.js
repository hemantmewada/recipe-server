import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    return res.json({
        status: true,
        message: "This domains api managed by @hemantmewada"
    });
})
app.use("/auth",userRouter);
app.use("/recipes",recipesRouter);
app.get("/api-check",(req, res) => {
    res.json("API is working fine..");
});
mongoose.connect("mongodb+srv://hmewada74:Mongodb0249@recipes.deif9w8.mongodb.net/recipes?retryWrites=true&w=majority&appName=recipes");

app.listen(3001, () => {
    return console.log("app is runnning on 3001 port");
});