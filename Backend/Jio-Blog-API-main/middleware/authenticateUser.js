import jwt from "jsonwebtoken";
import 'dotenv/config';

const authenticateUser=(req, res, next) => {
        
        try {
            const token = req.header('auth-token');
        if (!token) {
            return res.status(401).send({ message: "Authenticate using a valid token" });
        }
            const data = jwt.verify(token, process.env.SECRET_KEY);
            if (!data) {
                return res.status(401).send({ message: "Authenticate using a valid token "});
            }
            req.userId = data.id;
            next();
        } catch (error) {
            console.log(error);
            return res.status(501).json({ message: "You are not an authorised user to perform this operation." });
        }
    }

export default authenticateUser;