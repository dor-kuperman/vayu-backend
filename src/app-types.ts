import { ObjectId } from "mongodb";

export type UserStatuses = "pending" | "active" | "blocked";
export const userStatuses: UserStatuses[] = ["pending", "active", "blocked"]

export type User = {
    _id: ObjectId;
    email: string;
    status: UserStatuses;
    groups: ObjectId[];
};

type GroupStatuses = "empty" | "notEmpty";

export type Group = {
    _id: ObjectId;
    status: GroupStatuses;
};
