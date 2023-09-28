const dotenv = require("dotenv");
const mongoose = require("mongoose");
require('dotenv').config();
const data = process.env.DATABASE
mongoose.connect(data)
.then( ()=> console.log("connection successfull..."))
.catch((err) => console.log("no connection " + err));