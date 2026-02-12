import express from "express";
import {
  getMe,
  updatePassword,
  updateProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const userRoute = express.Router();

userRoute.get("/me", protect, getMe);
userRoute.patch("/me", protect, updateProfile);
userRoute.patch("/me/password", protect, updatePassword);
userRoute.get("/feed", protect, getFeed);
userRoute.post("/swipe", protect, swipeUser);
userRoute.get("/matches", protect, getMyMatches);

export default userRoute;
