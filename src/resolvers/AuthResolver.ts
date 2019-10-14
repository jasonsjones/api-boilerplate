import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../entity/User';
import { compareSync } from 'bcryptjs';

@Resolver()
class AuthResolver {
    @Mutation(() => Boolean)
    async login(@Arg('email') email: string, @Arg('password') password: string): Promise<boolean> {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return compareSync(password, user.password);
        }
        return false;
    }
}

export default AuthResolver;
