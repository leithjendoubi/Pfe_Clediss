import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    mongoose.connection.on('connected', () => {
      console.log("Database Connected");
    });
    
    mongoose.connection.on('error', (err) => {
      console.error("Database Connection Error:", err);
    });
  } catch (err) {
    console.error("Initial Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;