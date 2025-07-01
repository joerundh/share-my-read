import { createClient } from "next-sanity";

export const client = createClient({
    projectId: process.env.SANITY_API_PROJECT_ID,
    dataset: process.env.SANITY_API_DATASET,
    apiVersion: process.env.SANITY_API_VERSION,
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
});