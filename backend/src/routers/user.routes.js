import { Router } from "express";
import {
  followUser,
  getOtherUsers,
  getProfile,
  logOutUser,
  loginUser,
  registerUser,
  saveandunsaveBookMarks,
  unFollowUser,
  updatePassword,
  updateProfile,
} from "../controllers/user.Controller.js";
import { isAuthenticated } from "../middlewares/auh.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);
router.route("/bookmark/:id").put(isAuthenticated, saveandunsaveBookMarks);
router.route("/updatepassword/:id").put(isAuthenticated, updatePassword);
router.route("/updateuserprofile/:id").put(
  isAuthenticated,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateProfile
);
router.route("/getProfile/:id").get(isAuthenticated, getProfile);
router.route("/getOtherUsers/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, followUser);
router.route("/unfollow/:id").post(isAuthenticated, unFollowUser);

export default router;
