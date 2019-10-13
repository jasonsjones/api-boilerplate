import { Arg, Resolver, Mutation, Query } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../entity/User';

@Resolver()
class UserResolver {
    @Query(() => [User])
    allUsers(): Promise<User[]> {
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            const user = User.create({ email, password: hashedPassword });
            await user.save();
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }
}

export default UserResolver;
