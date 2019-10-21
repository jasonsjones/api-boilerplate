import { Arg, Resolver, Mutation, Query } from 'type-graphql';
import { MutationResponse } from '../types';
import { User } from '../entity/User';
import UserService from '../services/UserService';

@Resolver()
class UserResolver {
    @Query(() => [User])
    allUsers(): Promise<User[]> {
        return UserService.getAllUsers();
    }

    @Mutation(() => MutationResponse)
    async registerUser(
        @Arg('firstName') firstName: string,
        @Arg('lastName') lastName: string,
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<MutationResponse> {
        const response = await UserService.createUser(firstName, lastName, email, password);
        if (Array.isArray(response)) {
            return {
                success: false,
                message: 'unable to create user',
                error: response
            };
        }

        return {
            success: true,
            message: 'user created'
        };
    }
}

export default UserResolver;
