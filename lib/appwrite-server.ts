"use server"
import { Client, Account, Databases, Storage } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint) {
  throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT');
}

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID');
}

if (!apiKey) {
  throw new Error('Missing APPWRITE_API_KEY');
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };