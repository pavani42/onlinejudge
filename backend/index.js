const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { DBConnection } = require("./database/db");
const {generateFile} = require("./generateFile")
const {executeCpp} = require("./executeCpp")
const User = require("./models/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.get("/", (req, res) =>{
    res.send("Hello, World");
});

app.post("/register", async (req, res) => {
    try {
        //get all the data from body
        const { firstname, lastname, email, password } = req.body;

        // check that all the data should exists
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send("User already exists!");
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save the user in DB
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        // generate a token for user and send it
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        user.token = token;
        user.password = undefined;
        res
            .status(200)
            .json({ message: "You have successfully registered!", user });
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", async(req, res) =>{
    try{
        const{email,password} = req.body;
        if(!(email && password)){
            return res.status(400).send("Please enter all the information");
        }
        console.log(email);
        const userData = await User.findOne({ email });
        if(!userData){
            return res.status(404).send("User not found");
        }
        console.log(userData);
        const enteredPassword = bcrypt.compare(password, userData.password);
        if(!enteredPassword)
            return res.status(404).send("Password does not match");
        const token = jwt.sign({ id: userData._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        userData.token = token;
        userData.password = undefined;
    
        const options = {
            expires : new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly : true,
        };
    
        res.status(200).cookie("token", token, options).json({
            message : "You have Successfully logged in!",
            success : true,
            token,
        });
    }
    catch (error) {
        console.log(error);
    }   
});

app.post("/run", async (req, res) =>{
    const {language = 'cpp', code} = req.body;
    if(code == undefined){
        return res.status(500).json({success: true, error: "Empty Code Body"})
    }
    try{
        const filePath = generateFile(language, code);
        const output = await executeCpp(filePath);
        res.json({filePath, output});

    }
    catch(error){
        res.status(500).json({success: false, error: error.message})
    }
});

app.listen(8081, () =>{
    console.log("server is listening on port 8081!");
})