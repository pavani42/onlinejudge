const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { DBConnection } = require("./database/db");
const {generateFile} = require("./generateFile")
const {executeCpp, executeJava} = require("./executeCpp")
const User = require("./models/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const router = require('./router/router.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', router);

DBConnection();

app.get("/", (req, res) =>{
    res.send("Hello, World");
});

app.post("/run", async (req, res) =>{
    const {language = 'cpp', code} = req.body;
    if(code == undefined){
        return res.status(500).json({success: true, error: "Empty Code Body"})
    }
    try{
        const filePath = generateFile(language, code);
        if(language == 'cpp'){
        const output = await executeCpp(filePath);
        res.json({filePath, output});
        }
        else{
            const output = await executeJava(filePath);
            res.json({filePath, output});
        }

    }
    catch(error){
        res.status(500).json({success: false, error: error.message})
    }
});

app.listen(8081, () =>{
    console.log("server is listening on port 8081!");
})