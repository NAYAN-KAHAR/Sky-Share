
import mongoose from 'mongoose';

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yar3p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=MY-DATABASE`;

mongoose.connect(url);


export default mongoose;