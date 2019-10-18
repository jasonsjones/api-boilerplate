import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export const createDbConnection = async (): Promise<Connection> => {
    const env = process.env.NODE_ENV;
    if (env !== 'production') {
        const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
        return createConnection({ ...connectionOptions, name: 'default' });
    }
    return createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL
    });
};
