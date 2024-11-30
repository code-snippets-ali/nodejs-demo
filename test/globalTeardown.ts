const mongoose = require("mongoose");

const globalTeardown = async (): Promise<void> => {
    console.log("Running global teardown...");
    await mongoose.connection.close();
    console.log("Database connection closed.");
};

export default globalTeardown;
