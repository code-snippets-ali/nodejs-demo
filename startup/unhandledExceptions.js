const logger = require("../serviceobjects/Utilities/logger");

module.exports = function () {
    process.on("uncaughtException", (ex) => {
        console.log("Here is uncaught exception");
        logger.error(ex.message, {
            metadata: { Type: "Unhandled Exception" },
        });
    });
    process.on("unhandledRejection", (ex) => {
        console.log("Here is uncaught exception");
        logger.error(ex.message, {
            metadata: { Type: "Unhandled Exception" },
        });
    });
};
