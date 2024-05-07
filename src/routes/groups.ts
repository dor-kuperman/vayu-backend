import { Router } from "express";
import { removeUserFromGroup } from "../controllers/groups";

module.exports = (router: Router) => {
    router.put("/remove-user-from-group", removeUserFromGroup);
};