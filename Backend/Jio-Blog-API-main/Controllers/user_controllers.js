import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';


const signup = async (req, res) => {
    try {
        const { fname, lname, email, password, confirmPassword } = req.body;

        const user = await User.findOne({ email });
        

        if (user) {
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
    try {
        const { email, password } = req.body;

    const user = await User.findOne({ email });

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

    
    let accessToken= jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '1D' });
    let refreshToken= jwt.sign(data, process.env.SECRET_KEY, {expiresIn: '10D'});
    
    await User.updateOne({email : user.email},  { refreshToken: refreshToken });

    
    return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Internal server error"}); 
    }
    
}

const getAccessToken= (req, res)=>{
    try{
        const { refreshToken } = req.body;

        jwt.verify(refreshToken, process.env.SECRET_KEY, async (err, data)=>{
            if (err) {
                return res.status(400).json({message: "Invalid token"});
            }
            else{
                const user = await User.findOne({email: data.email });
    
                if (user && user.refreshToken == refreshToken) {
                    let accessToken = jwt.sign({
                        id: user._id,
                        email: user.email
                    }, process.env.SECRET_KEY, { expiresIn: "1D"});
                    return res.status(200).json({accessToken});
                }
                else{
                    return res.status(400).json({message: "Invalid refresh token"})
                }
            }
        });
    }
    catch(error){
        console.log(error);
    }
}


export { signup, login, getAccessToken };