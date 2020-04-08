require("dotenv").config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";
import { connectDatabase } from "./database";

const mount = async (app: Application) => {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
    context: () => ({ db }),
  });
  server.applyMiddleware({ app, path: "/api" });
  const PORT = process.env.PORT;
  const listenCB = () => console.log(`Server run on port ${PORT}`);
  app.listen(PORT, listenCB);
};

mount(express());
