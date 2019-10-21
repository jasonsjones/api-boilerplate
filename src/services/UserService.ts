import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { User } from '../entity/User';
import { Error } from '../types';

class UserService {
    static EMAIL_LENGTH = 3;
    static PASSWORD_LENGTH = 3;

    static getAllUsers(): Promise<User[]> {
        return User.find();
    }

    static async createUser(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ): Promise<User | Error[]> {
        const errors = await UserService.validateUserInfo(email, password);

        if (errors.length > 0) {
            return errors;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            const user = User.create({ firstName, lastName, email, password: hashedPassword });
            user.emailVerificationToken = v4();
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

    private static async validateUserInfo(email: string, password: string): Promise<Error[]> {
        const errors: Error[] = [];
        if (email.length < UserService.EMAIL_LENGTH) {
            errors.push({
                path: 'email',
                message: 'email is not valid'
            });
        }
        if (password.length < UserService.PASSWORD_LENGTH) {
            errors.push({
                path: 'password',
                message: 'password length is not strong enough'
            });
        }
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            errors.push({
                path: 'email',
                message: 'email already exists in database'
            });
        }
        return errors;
    }
}

export default UserService;
