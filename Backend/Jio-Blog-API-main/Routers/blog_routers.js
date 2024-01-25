import express from "express";

import { home, getBlogs, getBlogById, getPopular, myBlogs, addBlog,  updateBlog, deleteBlog} from "../Controllers/blog_controllers.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/", home);
router.get("/getBlogs", authenticateUser, getBlogs);
router.get("/getBlog/:id", authenticateUser, getBlogById);
router.get("/getPopular", authenticateUser, getPopular);
router.get("/myBlogs", authenticateUser, myBlogs);
router.post("/addBlog", authenticateUser, addBlog);
router.put("/updateBlog/:id", authenticateUser, updateBlog);
router.delete("/deleteBlog/:id", authenticateUser, deleteBlog);

export default router;