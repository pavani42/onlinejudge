const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const register = async (req, res) => {
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
}

const login = async(req, res) =>{
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
}

module.exports = {register, login};
