const mongoose = require("mongoose");
const { ensureUniqueIndexes, removeInvalidUsers } = require("../helpers/database-utils");

// Database connection
const MONGODB_URI = "mongodb+srv://emanuelnicholasnm:emanuelnicholasnm@cluster0.s8pfxat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function cleanupDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");

    console.log("\n1. Removing invalid user records...");
    const deletedCount = await removeInvalidUsers();
    
    console.log("\n2. Ensuring unique indexes...");
    await ensureUniqueIndexes();
    
    console.log("\n✅ Database cleanup completed successfully!");
    console.log(`- Removed ${deletedCount} invalid user records`);
    console.log("- Recreated unique indexes for email and userName");
    
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  }
}

// Run the cleanup
cleanupDatabase();