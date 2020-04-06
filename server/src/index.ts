import express from "express";
import { ApolloServer } from "apollo-server-express";
import { listings } from "./listings";
import { schema } from "./graphql";

const app = express();
const server = new ApolloServer({ schema });
server.applyMiddleware({ app, path: "/api" });

const PORT = 9000;

const listenCB = () => console.log(`Server run on port ${PORT}`);

app.listen(PORT, listenCB);
