import 'reflect-metadata';
import { createTypeormConnection } from './utils/createTypeormConnection';
import app from './app';

createTypeormConnection().then(() => {
    app.listen(3000, () => console.log('express server running at http://localhost:3000'));
});
