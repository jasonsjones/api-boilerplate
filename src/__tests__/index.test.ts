import request from 'supertest';
import app from '../app';

it('get / route returns json', () => {
    return request(app)
        .get('/')
        .then(res => {
            const json = res.body;
            expect(json).toHaveProperty('success');
            expect(json).toHaveProperty('message');
        });
});
