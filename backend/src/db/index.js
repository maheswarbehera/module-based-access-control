import mongoose from "mongoose";  

const connectDb = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`mongodb://localhost:27017/rbac-node`);
         
    } catch (error) {
         
        process.exit(1);
        
    }
}

export default connectDb;
