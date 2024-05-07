import { Request, Response } from "express";
import { dbGroups, dbUsers } from "../server";
import { ObjectId } from "bson";

export const removeUserFromGroup = async (req: Request, res: Response) => {
    try {
        const { groupId, userId } = req.body;
        console.log("start removeUserFromGroup", { groupId, userId });

        await dbUsers.updateOne(
            {
                _id: new ObjectId(userId),
            },
            {
                $set: {
                    groups: [],
                },
            }
        );

        const usersInGroup = await dbUsers.countDocuments({
            groups: new ObjectId(groupId),
        });

        if (!usersInGroup) {
            await dbGroups.updateOne(
                {
                    _id: new ObjectId(groupId),
                },
                {
                    $set: {
                        status: "empty",
                    },
                }
            );
        }

        return res.json("done");
    } catch (error) {
        console.log("error in removeUserFromGroup:", error);
        return res.json("error");
    }
};
