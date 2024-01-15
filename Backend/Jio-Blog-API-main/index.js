const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser')

const connectToMongo = require("./db.js");

const PORT = 5000;
const app = express();

const corsOption = {
    origin : "http://localhost:3000",
    methods : "GET, POST, PUT, DELETE",
    credentials : true
}

app.use(bodyParser.json());
app.use(cors(corsOption));

app.use("/api/blog", require("./Routers/blog_routers.js"));
app.use("/api/user", require("./Routers/user_routers.js"))

connectToMongo().then(()=> (
    app.listen(PORT, (req, res) => {
        console.log("Server is running at http://localhost:" + PORT);
    })
));






