import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const globalForMongoose = globalThis as typeof globalThis & {
    mongooseConn?: typeof mongoose | null;
    mongoosePromise?: Promise<typeof mongoose> | null;
    mongoMemoryServer?: MongoMemoryServer | null;
};

const connectToDatabase = async () => {
    if (globalForMongoose.mongooseConn) {
        return globalForMongoose.mongooseConn;
    }

    if (!globalForMongoose.mongoosePromise) {
        const mongoUri = process.env.MONGODB_URI;

        if (mongoUri) {
            globalForMongoose.mongoosePromise = mongoose.connect(mongoUri);
        } else if (process.env.VERCEL) {
            throw new Error('MONGODB_URI is required in Vercel deployments.');
        } else {
            globalForMongoose.mongoosePromise = MongoMemoryServer.create()
                .then((server) => {
                    globalForMongoose.mongoMemoryServer = server;
                    return mongoose.connect(server.getUri());
                });
        }
    }

    globalForMongoose.mongooseConn = await globalForMongoose.mongoosePromise;
    return globalForMongoose.mongooseConn;
};

export default connectToDatabase;
