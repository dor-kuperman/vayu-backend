import { Request, Response } from "express";
import { dbUsers } from "../server";
import { userStatuses } from "../app-types";
import { ObjectId } from "mongodb";
import { executeMongoBulk } from "../utils/mongo-bulk";

const getUserByField = async (
    req: Request,
    res: Response,
    { field, limit, offset }: { field?: string; limit?: string; offset?: string }
) => {
    try {
        const { value } = req.query;
        console.log(`start getUserBy ${field} ${value}`);

        const limitToUse = Number(limit) || 100;

        const offsetToUse = Number(offset) || 0;

        const users = await dbUsers
            .find(field ? { [field]: value } : {})
            .limit(limitToUse)
            .skip(offsetToUse)
            .toArray();

        return res.send(users);
    } catch (error) {
        console.log(`getUserBy${field} error:`, error);
        return res.send([]);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    const { offset, limit } = req.query;
    return getUserByField(req, res, {
        offset: offset as string,
        limit: limit as string,
    });
};

export const getUserByName = async (req: Request, res: Response) => {
    return getUserByField(req, res, { field: "name" });
};

export const getUserByEmail = async (req: Request, res: Response) => {
    return getUserByField(req, res, { field: "email" });
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

        const bulkRes = await executeMongoBulk(usersBulk);

        return res.send(bulkRes);
    } catch (error) {
        console.log("updateUsersStatus error:", error);
        return res.send([]);
    }
};
