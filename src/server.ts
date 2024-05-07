import { Collection, MongoClient } from "mongodb";
import { Group, User } from "./app-types";

export let dbUsers: Collection<User>;
export let dbGroups: Collection<Group>;

async function initDatabases(client: MongoClient) {
    dbUsers = await client.db("vayu").collection<User>("Users");
    dbGroups = await client.db("vayu").collection<Group>("Groups");
}

export const initMongo = async () => {
    // TODO: implement using mongoose
    const { MONGO_CONNECTION_STRING } = process.env
    const client = new MongoClient(MONGO_CONNECTION_STRING as any);
    try {
        await client.connect();
        initDatabases(client);
    } catch (e) {
        console.error(e);
    }
};
