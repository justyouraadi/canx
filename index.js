const express = require('express');
const { ServerConfig } = require('./src/config');
const connectToDB = require('./src/config/db.config');
const apiRoutes = require("./src/routes")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);


app.listen(ServerConfig.Base.PORT,async()=>{
    await connectToDB();
    console.log(`Server is booming on port ${ServerConfig.Base.PORT} 🚀`);
})