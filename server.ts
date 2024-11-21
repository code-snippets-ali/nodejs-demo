require("express-async-errors");
const app = require("./startup/routes");
require("./startup/config")();
require("./startup/db")();
const port = process.env.PORT || 8182;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
require("./startup/unhandledExceptions")(server);
