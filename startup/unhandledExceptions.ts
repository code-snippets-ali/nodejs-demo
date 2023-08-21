const { logger } = require("../serviceobjects/Utilities/logger");

module.exports = function (server: any) {
    process.on("uncaughtException", (ex: any) => {
        console.log("Here is uncaught exception");
        logger.error(ex.message, {
            metadata: { Type: "Unhandled Exception" },
        });
        server.close(() => {
            console.log("Exit Process");
            process.exit(1);
        });
    });
    process.on("unhandledRejection", (ex: any) => {
        console.log("Here is uncaught exception");
        logger.error(ex.message, {
            metadata: { Type: "Unhandled Exception" },
        });
        server.close(() => {
            console.log("Exit Process");
            process.exit(1);
        });
    });
};
