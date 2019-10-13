import { createTypeormConnection } from '../utils/createTypeormConnection';

import { getConnection } from 'typeorm';
import request from 'supertest';
import app from '../app';
import { User } from '../entity/User';

beforeAll(() => {
    return createTypeormConnection();
});

afterAll(() => {
    getConnection().close();
});

it('get / route returns json', () => {
    return request(app)
        .get('/')
        .then(res => {
            const json = res.body;
            expect(json).toHaveProperty('success');
            expect(json).toHaveProperty('message');
        });
});

describe('hello world query', () => {
    it('returns hello world', () => {
        const query = `
            query {
                hello
            }
        `;

        return request(app)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({ query })
            .then(res => {
                const { data } = res.body;
                expect(data).toEqual({ hello: 'hello world' });
            });
    });
});

describe('mutation to create a user', () => {
    it('creates a user', () => {
        const email = 'test-user@example.com';
        const password = '123456';
        const query = `
            mutation RegisterUser($email: String!, $password: String!) {
                register(email: $email, password: $password)
            }
        `;

        const variables = {
            email,
            password
        };

        return request(app)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({ query, variables })
            .then(res => {
                const { data } = res.body;
                expect(data).toEqual({ register: true });
                return User.find({ where: { email } });
            })
            .then(users => {
                const [user] = users;
                expect(users).toHaveLength(1);
                expect(user.email).toEqual(email);
                expect(user.password).not.toEqual(password);
            });
    });
});
