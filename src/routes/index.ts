import { Application, Router } from "express";
import fs from "fs";
import path from "path";

const normalizedPath = path.join(__dirname);

export default (app: Application) => {
    fs.readdirSync(normalizedPath).forEach((filename: string) => {
        const router = Router();
        const filenameParts = filename.split(".");
        const routeName = filenameParts[0];
        const extension = filenameParts.slice(-1).pop();
        if (!["js", "ts"].includes(extension as string) || routeName === "index") {
            return;
        }
        const forceRoute = require(`./${routeName}`)(router);
        app.use(forceRoute ? forceRoute : `/${routeName}`, router);
    });
};
