require("express-async-errors");
const app = require("./startup/routes");
require("./startup/config")();
const port = process.env.PORT || 8182;

if (process.env.NODE_ENV !== "test") {
    const server = app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
    require("./startup/unhandledExceptions")(server);
}
require("./startup/db")();
module.exports = app;
