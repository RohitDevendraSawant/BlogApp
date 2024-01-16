import express from "express";

import { getBlogs, getBlogById, getPopular, addBlog,  updateBlog, deleteBlog} from "../Controllers/blog_controllers.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

// router.get("/", authControllers.home);
router.get("/getBlogs", authenticateUser, getBlogs);
router.get("/getBlog/:id", authenticateUser, getBlogById);
router.get("/getPopular", authenticateUser, getPopular);
router.post("/addBlog", authenticateUser, addBlog);
router.put("/updateBlog/:id", authenticateUser, updateBlog);
router.delete("/deleteBlog/:id", authenticateUser, deleteBlog);

export default router;