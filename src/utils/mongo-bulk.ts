import { UnorderedBulkOperation } from "mongodb"

export const executeMongoBulk = async (bulk: UnorderedBulkOperation) => {
    try {
        return await bulk.execute()
    } catch (error) {
        console.log('executeMongoBulk error:', error);
    }
}