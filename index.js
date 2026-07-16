import { configDotenv } from "dotenv";
configDotenv();

import e from "express";
import cors from 'cors';
import { connectDB } from "./src/config/db.js";

const app = e();

const PORT = process.env.PORT || 8000;

app.use(cors());

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();
