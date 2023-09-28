require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose")
require("./db/conn");
const port = process.env.PORT || 8000;
const cors = require("cors");
const router = require("./routes/router");
const cookiParser = require("cookie-parser")

app.use(cors());
app.use(express.json());
app.use(cookiParser());
app.use(router);

app.listen(port, () =>{
    console.log(`server is starting port number ${port}`);
})
