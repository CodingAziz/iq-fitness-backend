import mongoose from "mongoose";

export const connectDB = async () => {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI).then((conn) => {
            const dbName = conn.connections[0].name;
            console.log(`DB Name: ${dbName}`);
            console.log(`Mongo DB connection successfull`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}