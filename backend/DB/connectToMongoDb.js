import mongoose from "mongoose";

const connectToMongoDb = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to mongodb');
    } catch(error) {
        console.log("Error connecting to mongodb", error.message);
    }
};

export default connectToMongoDb;