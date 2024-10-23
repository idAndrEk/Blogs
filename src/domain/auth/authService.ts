import {UsersQueryRepository} from "../../repositories/users/usersQueryRepository";

const bcrypt = require('bcrypt')

export const authService = {

    async passwordToSave(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await UsersQueryRepository.findCheckUserByLogin(loginOrEmail);
        if (!user) {
            return false
        }
        return await bcrypt.compare(password, user.passwordHash)
    }

}