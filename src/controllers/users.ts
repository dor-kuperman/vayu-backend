import { Request, Response } from "express";
import { dbUsers } from "../server";
import { userStatuses } from "../app-types";
import { ObjectId } from "mongodb";
import { executeMongoBulk } from "../utils/mongo-bulk";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { offset, limit } = req.query;
        // TODO: log the query when implemented
        console.log("start getUsers", { offset, limit });

        const limitToUse = Number(limit) || 100;

        const offsetToUse = Number(offset) || 0;

        // TODO: Add here future query
        const query = {};

        const users = await dbUsers
            .find(query)
            .limit(limitToUse)
            .skip(offsetToUse)
            .toArray();

        const totalUsers = await dbUsers.countDocuments(query);

        return res.send({ users, totalUsers });
    } catch (error) {
        console.log("getUsers error:", error);
        return res.send({ users: [], totalUsers: 0 });
    }
};

export const getUserByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.query;
        console.log("start getUserByEmail");

        if (!name) {
            return res.send("No name was sent");
        }

        const users = await dbUsers.find({ name }).toArray();

        return res.send(users);
    } catch (error) {
        console.log("getUserByEmail error:", error);
        return res.send([]);
    }
};

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.query;
        console.log("start getUserByEmail");

        if (!email) {
            return res.send("No email was sent");
        }

        const users = await dbUsers.find({ email }).toArray();

        return res.send(users);
    } catch (error) {
        console.log("getUserByEmail error:", error);
        return res.send([]);
    }
};

export const updateUsersStatus = async (req: Request, res: Response) => {
    try {
        const userIdsAndStatuses = req.body;
        console.log("start updateUsersStatus");

        if (userIdsAndStatuses.length > 500) {
            return res.send(
                `The limit of the userIds to be sent is 500. You sent: ${userIdsAndStatuses.length}`
            );
        }

        if (!userIdsAndStatuses.length) {
            return res.send(`No ids were sent`);
        }

        const firstElementIsByFormat =
            userIdsAndStatuses?.[0]?.userId && userIdsAndStatuses?.[0]?.status;

        if (!userStatuses.includes(firstElementIsByFormat)) {
            return res.send("Please re-check your format");
        }
        const usersBulk = await dbUsers.initializeUnorderedBulkOp();
        for (const { userId, status } of userIdsAndStatuses) {
            try {
                if (!userStatuses.includes(status)) {
                    console.log(`${userId} status is not by accepted values:`, status);
                    continue;
                }
                usersBulk.find({ _id: new ObjectId(userId) }).update({
                    $set: { status },
                });
            } catch (error) {
                console.log(`${userId} error:`, error);
            }
        }

        const bulkRes = await executeMongoBulk(usersBulk)

        return res.send(bulkRes);
    } catch (error) {
        console.log("updateUsersStatus error:", error);
        return res.send([]);
    }
};
