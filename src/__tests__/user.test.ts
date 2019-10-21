import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';
import { User } from '../entity/User';
import { createDbConnection } from '../utils/createDbConnection';
import UserService from '../services/UserService';

const makeGraphQLCall = (query: string, variables = {}): request.Test => {
    return request(app)
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .send({ query, variables });
};

beforeAll(() => {
    return createDbConnection();
});

afterAll(() => {
    getConnection().close();
});

describe('mutation to create a user', () => {
    const firstName = 'Test';
    const lastName = 'User';
    const email = 'test-user@example.com';
    const password = '123456';
    const query = `
        mutation RegisterUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
            registerUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
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
            firstName,
            lastName,
            email,
            password
        };

        return makeGraphQLCall(query, variables)
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
            firstName,
            lastName,
            email,
            password
        };

        return makeGraphQLCall(query, variables).then(res => {
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

    it('returns an error if the email is not long enough', () => {
        const variables = {
            firstName,
            lastName,
            email: 'jj',
            password
        };

        return makeGraphQLCall(query, variables).then(res => {
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

    it('returns an error if the password is not long enough', () => {
        const variables = {
            firstName,
            lastName,
            email: 'weak-password@example.com',
            password: 'ab'
        };

        return makeGraphQLCall(query, variables).then(res => {
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

    it('returns multiple errors if the email and password are not long enough', () => {
        const variables = {
            firstName,
            lastName,
            email: 'ab',
            password: 'cd'
        };

        return makeGraphQLCall(query, variables).then(res => {
            const json = res.body.data.registerUser;
            expect(json).toHaveProperty('success');
            expect(json).toHaveProperty('message');
            expect(json).toHaveProperty('error');
            expect(json.success).toBeFalsy();
            expect(json.error).toHaveLength(2);
            const error = json.error[0];
            expect(error).toHaveProperty('path');
            expect(error).toHaveProperty('message');
        });
    });
});

describe('query for allUsers', () => {
    beforeAll(async () => {
        await getConnection().manager.clear(User);
        return UserService.createUser('Test', 'User1', 'test-user1@example.com', 'plaintext').then(
            () => UserService.createUser('Test', 'User2', 'test-user2@example.com', 'plaintext')
        );
    });

    it('returns all the users', () => {
        const query = `
            query {
                allUsers {
                    id
                    firstName
                    lastName
                    email
                    isEmailVerified
                    emailVerificationToken
                    createdAt
                }
            }
        `;

        return makeGraphQLCall(query).then(res => {
            const { data } = res.body;
            expect(data.allUsers).toHaveLength(2);
            const firstUser = data.allUsers[0];
            expect(firstUser).toHaveProperty('id');
            expect(firstUser).toHaveProperty('email');
            expect(firstUser).toHaveProperty('firstName');
            expect(firstUser).toHaveProperty('lastName');
            expect(firstUser).toHaveProperty('isEmailVerified');
            expect(firstUser).toHaveProperty('emailVerificationToken');
            expect(firstUser).toHaveProperty('createdAt');
        });
    });
});
