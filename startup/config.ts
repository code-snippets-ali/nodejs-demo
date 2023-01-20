import { appConfig, Settings } from "../serviceobjects/Utilities/Settings";

const config = require("config");
module.exports = function () {
    if (!appConfig(Settings.JWTPrivateKey)) {
        throw new Error("Fatal error: JWTPrivateKey is not set");
        process.exit(1);
    }
};
