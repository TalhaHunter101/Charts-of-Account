const express = require("express");
const app = express();
const PORT = 8888;
const mongo = require("./DB/connect");

// rendering routes

app.use("", require("./Routers/Routers"));
app.use("", require("./Routers/Transaction_routers"));
app.use("/users", require("./Routers/users_routers"));

// Listening on this port

app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT} `);
});
