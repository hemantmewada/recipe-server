import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

// register api
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (user) {
            return res.json({
                status : false,
                message : "User already exist."
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, password : hashedPassword });
        const register = await newUser.save();
        if (!register) {
            return res.json({
                status: false,
                message: "User registration has been failed."
            });
        }
        return res.json({
            status: true,
            message: "User registered successfully.",
            data : register
        });
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.json({
                status : false,
                message : "User doesn't exist."
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({
                status : false,
                message : "Password is incorrect."
            });
        }
        const token = jwt.sign({ id : user._id }, "secret");
        return res.json({
            status : true,
            token,
            userId : user._id,
            message: "User logged in successfully.",
        });
    } catch (error) {
        return res.json({
            status: false,
            message: "Error caught is API : " + error.message
        });
    }

});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "secret", (error) => {
            if(error) return res.sendStatus(403);
            next();
        })
    } else {
        res.sendStatus(401);
    }
}