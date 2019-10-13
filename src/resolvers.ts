import bcrypt from 'bcryptjs';
import { User } from './entity/User';

export const resolvers = {
    Query: {
        hello: (): string => 'hello world'
    },
    Mutation: {
        register: async (
            _: any,
            { email, password }: GQL.IRegisterOnMutationArguments
        ): Promise<boolean> => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({ email, password: hashedPassword });
            await user.save();
            return true;
        }
    }
};
