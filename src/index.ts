import 'reflect-metadata';
import { createDbConnection } from './utils/createDbConnection';
import app from './app';

createDbConnection().then(() => {
    app.listen(3000, () => console.log('express server running at http://localhost:3000'));
});
