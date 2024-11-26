import mongoose from "mongoose";
import env from "@/env"

type ConnectionObject = {
    isConnected?: number; // 0: disconnected, 1: connected its optional
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        return;
    } // Use existing database connection if already connected

    try {
        const db = (await mongoose.connect(
            `${env.mongodb.mongoDbUri}/${env.mongodb.dbName}`
        ));
        connection.isConnected = db.connections[0].readyState;
        console.log(`Database connected Successfully ${db.connection.host}`);
    } catch (error) {
        console.log("Error connecting to database: ", error);
        process.exit(1);
    }
}

export default dbConnect;
