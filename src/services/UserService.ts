import bcrypt from 'bcryptjs';
import { User } from '../entity/User';
import { Error } from '../types';

class UserService {
    static getAllUsers(): Promise<User[]> {
        return User.find();
    }

    static async createUser(email: string, password: string): Promise<User | Error[]> {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return [
                {
                    path: 'email',
                    message: 'email already exists in database'
                }
            ];
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            const user = User.create({ email, password: hashedPassword });
            return user.save();
        } catch (err) {
            console.error(err);
            return [
                {
                    path: 'create user',
                    message: err.message
                }
            ];
        }
    }
}

export default UserService;
