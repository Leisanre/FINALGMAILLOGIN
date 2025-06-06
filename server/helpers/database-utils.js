const User = require("../models/User");

/**
 * Clean up orphaned user records and resolve duplicate issues
 */
const cleanupUserData = async (email) => {
  try {
    // Find all users with the given email (should be unique but might have duplicates due to race conditions)
    const users = await User.find({ email: email });
    
    if (users.length > 1) {
      // Keep the most recent user and remove duplicates
      const sortedUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const userToKeep = sortedUsers[0];
      const usersToDelete = sortedUsers.slice(1);
      
      for (const user of usersToDelete) {
        await User.findByIdAndDelete(user._id);
      }
      
      console.log(`Cleaned up ${usersToDelete.length} duplicate user records for email: ${email}`);
      return userToKeep;
    }
    
    return users[0] || null;
  } catch (error) {
    console.error("Error cleaning up user data:", error);
    throw error;
  }
};

/**
 * Check and fix database indexes
 */
const ensureUniqueIndexes = async () => {
  try {
    // Drop existing indexes and recreate them to ensure uniqueness
    await User.collection.dropIndexes();
    
    // Recreate unique indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ userName: 1 }, { unique: true });
    
    console.log("Database indexes recreated successfully");
  } catch (error) {
    console.error("Error ensuring unique indexes:", error);
    throw error;
  }
};

/**
 * Find and remove any users with null or empty emails
 */
const removeInvalidUsers = async () => {
  try {
    const result = await User.deleteMany({
      $or: [
        { email: null },
        { email: "" },
        { email: { $exists: false } }
      ]
    });
    
    if (result.deletedCount > 0) {
      console.log(`Removed ${result.deletedCount} invalid user records`);
    }
    
    return result.deletedCount;
  } catch (error) {
    console.error("Error removing invalid users:", error);
    throw error;
  }
};

module.exports = {
  cleanupUserData,
  ensureUniqueIndexes,
  removeInvalidUsers
};