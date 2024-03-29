import Blog from "../models/blog.js";
import escapeStringRegexp from "escape-string-regexp";
import { createClient } from "redis";
import blog from "../models/blog.js";


// const redisClient = createClient({
//   password: "nnBgvj4JbozDfNlP8VXBCNanDhos5FYz",
//   socket: {
//     host: "redis-19577.c301.ap-south-1-1.ec2.cloud.redislabs.com",
//     port: 19577,
//   },
// });

const redisClient = createClient({ host: 'localhost', port: 6379 });

(async () => {
  await redisClient.connect();
})();

redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("error", (err) =>
  console.log("Redis client connection error", err)
);

const home = (req, res) => {
  res.json({ Greetings: "Welcome to MyBlog.in" });
};

const getBlogs = async (req, res) => {
  try {
    const searchText = req.query.search;
    let blogs;
    if (searchText) {
      const $regex = escapeStringRegexp(searchText.toString());
      blogs = await Blog.find({$or: [{ title: { $regex } }, { content: { $regex }}]});
    } else {
      blogs = await Blog.find();
    }
    return res.status(200).json(blogs);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ messsage: "Internal server error." });
  }
};

const getBlogById = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "blog not found." });
    }
    let id = req.params.id;
    let data = await redisClient.get(id);
    let count;
    let blogData;

    if (data == null) {
      count = 0;
      blogData = { count, blog: {} };
    } else {
      let objData = JSON.parse(data);
      count = objData.count;
      count = count + 1;
      blogData = { count, blog: {} };
    }

    if (count > 5) {
      blogData = {count, blog};
    }

    blogData = JSON.stringify(blogData);
    redisClient.set(id, blogData);

    return res.status(200).json(blog);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ messsage: "Internal server error." });
  }
};

const getPopular = async (req, res) => {
    try {
      const keys = await redisClient.keys("*");
      let blogs = [];
  
      for (const key of keys) {
        try {
          const data = await redisClient.get(key);
          const objData = JSON.parse(data);
          let blog = objData.blog
          if (Object.keys(blog).length == 0) {
            continue;
          }
          else{
            blogs.push(objData.blog);
          }
        } catch (error) {
          console.error(`Error retrieving data for key ${key}: ${error.message}`);
        }
      }
  
      res.status(200).json(blogs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ messsage: "Internal server error." });
    }
  };
  

  const myBlogs = async (req, res)=> { 
    try {
      const blogs = await Blog.find({authorId: req.userId});
      return res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ messsage: "Internal server error." });
  }
}

const addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (
      !title ||
      title.length === 0 ||
      !content ||
      content.length === 0
    ) {
      return res.status(400).json({ message: "Enter valid data" });
    }

    const newBlog = new Blog({
      title,
      author: req.userName,
      authorId: req.userId,
      content,
      date: new Date().toLocaleDateString(),
    });
    const addedBlog = await newBlog.save();
    return res.status(201).json({ message: "Blog added.", addedBlog });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ messsage: "Internal server error." });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    let blog;
    try {
      blog = await Blog.findById(req.params.id);
    } catch (error) {
      return res.status(404).json({ message: "Blog not found." })
    }
  
    if (req.userId != blog.authorId) {
      return res
        .status(401)
        .json({ message: "You are unauthorized to perform this operation." });
    }

    const updatedBlog = {};
    if (title) {
      updatedBlog.title = title;
    }
    if (content) {
      updatedBlog.content = content;
    }

    const update = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updatedBlog },
      { new: true }
    );

    let cacheData = await redisClient.get(req.params.id);
    let data = JSON.parse(cacheData);
    data.blog = update;
    let jsonData = JSON.stringify(data);
    await redisClient.set(req.params.id, jsonData);
    res.status(201).json({ message: "Blog updated successfully." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ messsage: "Internal server error." });
  }
};

const deleteBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    if (req.userId != blog.authorId) {
      return res
        .status(401)
        .json({ message: "You are unauthorized to perform this operation." });
    }

    await Blog.findByIdAndDelete(req.params.id);
    await redisClient.del(req.params.id);

    return res.status(201).json({ message: "Blog deleted." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ messsage: "Internal server error." });
  }
};

export {
  home,
  getBlogs,
  getBlogById,
  getPopular,
  myBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
};
