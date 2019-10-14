import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export const createDbConnection = async (): Promise<Connection> => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return createConnection({ ...connectionOptions, name: 'default' });
};