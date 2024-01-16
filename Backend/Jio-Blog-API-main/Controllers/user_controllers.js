import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const isUserExist = async (email) => {
    const user = await User.findOne({ email });
    if (user === null) {
        return false;
    }
    return user;
}

const signup = async (req, res) => {
    try {
        const { fname, lname, email, password, confirmPassword } = req.body;

        const flag = await isUserExist(email)

        if (flag) {
            return res.status(400).json({ message: "User with this email already exist." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password is not matching with confirm password" });
        }

        const name = fname + " " + lname;
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, email, password: encryptedPassword
        });
        const addedUser = await newUser.save();

        return res.status(201).json(addedUser);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await isUserExist(email);

    if (!user) {
        return res.status(400).json("Invalid credentials");
    }

    const isAuthenticated = await bcrypt.compare(password, user.password)

    if (!isAuthenticated) {
        return res.status(400).json("Invalid credentials");
    }

    const data = {
        id: user._id,
        email: user.email
    }

    const authToken= jwt.sign(data, process.env.SECRET_KEY);
    return res.status(200).json({ authToken });
}


export { signup, login };