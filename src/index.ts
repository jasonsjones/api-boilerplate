import 'reflect-metadata';
import { createDbConnection } from './utils/createDbConnection';
import app from './app';

const PORT = process.env.PORT || 3000;

createDbConnection().then(() => {
    app.listen(PORT, () => console.log(`express server running at http://localhost:${PORT}`));
});
