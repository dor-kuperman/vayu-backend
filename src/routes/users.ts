import { Router } from "express";
import { getUsers, getUserByEmail, updateUsersStatus, getUserByName } from "../controllers/users";

module.exports = (router: Router) => {
    router.get("/", getUsers);
    router.get("/by-email", getUserByEmail);
    router.get("/by-name", getUserByName);
    router.post("/update-statuses", updateUsersStatus);
};