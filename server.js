
require("dotenv").config();

const connectDB = require("./config/db");
const seedDefaultEvents = require("./seeders/eventSeeder");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Insert default events if the collection is empty
    await seedDefaultEvents();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`TownPulse server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
