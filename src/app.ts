import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';

const app = express();
app.get('/', (_, res) => res.json({ success: true, message: 'welcome to a new stack' }));

const typeDefs = importSchema(path.join(__dirname, 'schema.graphql'));
const apolloServer = new ApolloServer({ typeDefs, resolvers });

apolloServer.applyMiddleware({ app });

export default app;
