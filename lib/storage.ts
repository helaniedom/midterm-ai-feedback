import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const tableName = "Feedback";

export async function saveFeedback(text: string, sentiment: string) {
    const client = TableClient.fromConnectionString(connectionString, tableName);

    await client.createTable().catch(() => {
        // Table already exists
    });

    const entity = {
        partitionKey: "feedback",
        rowKey: Date.now().toString(),
        text,
        sentiment,
        createdAt: new Date().toISOString(),
    };

    await client.createEntity(entity);
    }

    export async function getFeedback() {
    const client = TableClient.fromConnectionString(connectionString, tableName);

    const feedback = [];

    for await (const entity of client.listEntities()) {
        feedback.push(entity);
    }

    return feedback;
}