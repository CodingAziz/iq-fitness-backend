import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import cors from 'cors';
import { connectDB } from "./src/config/db.js";

const app = express();

const PORT = process.env.PORT || 8000;
app.use(cors());
await connectDB();
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
