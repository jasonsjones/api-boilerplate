import { Arg, Resolver, Mutation, Query, ObjectType, Field } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../entity/User';

@ObjectType()
class Error {
    @Field()
    path: string;

    @Field()
    message: string;
}

@ObjectType()
class MutationResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => [Error], { nullable: true })
    error?: Error[];
}

@Resolver()
class UserResolver {
    @Query(() => [User])
    allUsers(): Promise<User[]> {
        return User.find();
    }

    @Mutation(() => MutationResponse)
    async registerUser(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<MutationResponse> {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return {
                success: false,
                message: 'unable to create user',
                error: [
                    {
                        path: 'email',
                        message: 'email already exists in database'
                    }
                ]
            };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            const user = User.create({ email, password: hashedPassword });
            await user.save();
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: 'unable to create user',
                error: [
                    {
                        path: 'create user',
                        message: err.message
                    }
                ]
            };
        }

        return {
            success: true,
            message: 'user created'
        };
    }
}

export default UserResolver;
