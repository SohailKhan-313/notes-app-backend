const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'notes_app',
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Tip: If using MongoDB Atlas, check your MONGO_URI in backend/.env, IP whitelist, and user credentials.');
    console.error('💡 Tip: If using local MongoDB, ensure your MongoDB service (mongod) is running.');
  }
};

module.exports = connectDB;
