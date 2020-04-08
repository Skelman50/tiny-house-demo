require("dotenv").config();

import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const url = `mongodb+srv://${user}:${password}@${cluster}.mongodb.net/test?retryWrites=true&w=majority`;
export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("main");
  return {
    listings: db.collection("test_listings"),
  };
};
