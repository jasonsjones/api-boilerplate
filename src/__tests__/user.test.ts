import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';
import { User } from '../entity/User';
import { createDbConnection } from '../utils/createDbConnection';

beforeAll(() => {
    return createDbConnection();
});

afterAll(() => {
    getConnection().close();
});

describe('mutation to create a user', () => {
    const email = 'test-user@example.com';
    const password = '123456';
    const query = `
        mutation RegisterUser($email: String!, $password: String!) {
            registerUser(email: $email, password: $password) {
                success
                message
                error {
                    path
                    message
                }
            }
        }
    `;

    it('creates a user', () => {
        const variables = {
            email,
            password
        };

        return request(app)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({ query, variables })
            .then(res => {
                const json = res.body.data.registerUser;
                expect(json).toHaveProperty('success');
                expect(json).toHaveProperty('message');
                expect(json).toHaveProperty('error');
                expect(json.success).toBeTruthy();
                expect(json.error).toBeFalsy();
                return User.find({ where: { email } });
            })
            .then(users => {
                const [user] = users;
                expect(users).toHaveLength(1);
                expect(user.email).toEqual(email);
                expect(user.password).not.toEqual(password);
            });
    });

    it('returns an error if the email already exists', () => {
        const variables = {
            email,
            password
        };

        return request(app)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({ query, variables })
            .then(res => {
                const json = res.body.data.registerUser;
                expect(json).toHaveProperty('success');
                expect(json).toHaveProperty('message');
                expect(json).toHaveProperty('error');
                expect(json.success).toBeFalsy();
                expect(json.error).toHaveLength(1);
                const error = json.error[0];
                expect(error).toHaveProperty('path');
                expect(error).toHaveProperty('message');
            });
    });
});

describe('query for allUsers', () => {
    beforeAll(async () => {
        await getConnection().manager.clear(User);
        const user1 = User.create({ email: 'test-user1@example.com', password: 'plaintext' });
        const user2 = User.create({ email: 'test-user2@example.com', password: 'plaintext' });
        return user1.save().then(() => user2.save());
    });

    it('returns all the users', () => {
        const query = `
            query {
                allUsers {
                    id
                    email
                    createdAt
                }
            }
        `;

        return request(app)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send({ query })
            .then(res => {
                const { data } = res.body;
                expect(data.allUsers).toHaveLength(2);
                const firstUser = data.allUsers[0];
                expect(firstUser).toHaveProperty('id');
                expect(firstUser).toHaveProperty('email');
                expect(firstUser).toHaveProperty('createdAt');
            });
    });
});
