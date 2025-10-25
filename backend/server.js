// Importing third-party modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importing custom modules
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Setting up the environment det
dotenv.config();
connectDB();

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server is current running @ http://localhost:${PORT}`))