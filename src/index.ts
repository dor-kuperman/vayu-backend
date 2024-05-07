import express from "express";

import dotenv from "dotenv";
import { initMongo } from "./server";
import initRoutes from './routes/index'
import bodyParser from "body-parser";

export const app = express();

dotenv.config();

app.get("/", (req, res) => {
    res.send("Main route");
});
app.use(bodyParser.json())
app.listen(3000, () => {
    console.log(`App is listening on port ${3000}`);
    initMongo();
    initRoutes(app)
});
