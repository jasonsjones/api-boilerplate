import 'reflect-metadata';
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import UserResolver from './resolvers/UserResolver';
import AuthResolver from './resolvers/AuthResolver';

const bootstrapApolloServer = async (expressApp: Application): Promise<ApolloServer> => {
    const schema = await buildSchema({ resolvers: [AuthResolver, UserResolver] });
    const apolloServer = new ApolloServer({ schema });
    apolloServer.applyMiddleware({ app: expressApp });
    return apolloServer;
};

const app = express();
app.get('/', (_, res) => res.json({ success: true, message: 'welcome to a new stack' }));

bootstrapApolloServer(app);

export default app;
