import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";

import connectToMongo from "./db.js";

import blog_routers from "./Routers/blog_routers.js";
import user_routers from "./Routers/user_routers.js";

const app = express();

const corsOption = {
    origin : "http://localhost:3000",
    methods : "GET, POST, PUT, DELETE",
    credentials : true
}

connectToMongo();

app.use(bodyParser.json());
app.use(cors(corsOption));

app.use("/api/blog", blog_routers);
app.use("/api/user", user_routers);

export default app;
