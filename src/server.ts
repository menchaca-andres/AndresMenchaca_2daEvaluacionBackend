import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { join } from "path";
import resolvers from "./resolvers";
import { config } from "./config";

const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf-8");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  context: ({ request }) => ({
    authHeader: request.headers.get("authorization") || "",
  }),
});

const server = createServer(yoga);

server.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
});