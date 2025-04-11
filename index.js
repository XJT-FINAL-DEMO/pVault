import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './router/userrouter.js';
import pVaultRouter from './router/pVaultrouter.js';



// databse conection 
await mongoose.connect(process.env.MONGO_URI);

// create the express app
const app = express();

// use of midlewares
app.use(express.json());
app.use(cors());

// routers to be used
app.use(userRouter);
app.use(pVaultRouter)



// listening server port
const port = process.env.Port || 7000;
app.listen(port,() =>{
    console.log(`pVault is Active on ${port}`);
})