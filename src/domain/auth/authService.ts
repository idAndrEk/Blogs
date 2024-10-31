import jwt from 'jsonwebtoken'

const bcrypt = require('bcrypt')


export const authService = {

    async passwordToSave(password: string) {
        return await bcrypt.hash(password, 10)
    },

    // async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
    //     const user = await UsersQueryRepository.findCheckUserByLogin(loginOrEmail);
    //     if (!user) {
    //         return false
    //     }
    //     return await bcrypt.compare(password, user.passwordHash)
    // },

}