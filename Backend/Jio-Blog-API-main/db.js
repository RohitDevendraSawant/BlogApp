import mongoose from 'mongoose';
import 'dotenv/config';

const url = process.env.URL;

const connectToMongo = async () => {
    // await mongoose.connect(url);
    await mongoose.connect('mongodb://127.0.0.1:27017/blogApp');
};
export default connectToMongo;
