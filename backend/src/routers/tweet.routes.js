import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getFollowingtweets,
  likeTweetOrDislikeTweet,
  updateTweet,
} from "../controllers/tweet.Controller.js";
import { isAuthenticated } from "../middlewares/auh.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router
  .route("/create")
  .post(isAuthenticated, upload.single("postImage"), createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/likes/:id").put(isAuthenticated, likeTweetOrDislikeTweet);
router
  .route("/update/:id")
  .put(isAuthenticated, upload.single("postImage"), updateTweet);
router.route("/getalltweets/:id").get(isAuthenticated, getAllTweets);
router.route("/getallfollowingtweets/:id").get(isAuthenticated, getFollowingtweets);

export default router;
