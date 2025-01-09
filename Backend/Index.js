import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import usersroutes from './routes/users.js';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/users', usersroutes)

const dburl = process.env.DB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(dburl),
        console.log('MongoDB Connected....');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
};

connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});