import * as bcrypt from 'bcrypt';
import { envs } from '../../config';

interface SeedUser {
    username: string;
    fullName: string;
    password: string;
    roles: string[];
    isActive: boolean;
}

interface SeedData {
    user: SeedUser;
}

export const initialData: SeedData = {

    user:{
        fullName: 'Admin User',
        username: 'admin123',
        isActive: true,
        roles: ['admin', 'regular'],
        password: bcrypt.hashSync(envs.adminUserPw, 10),
    },

}