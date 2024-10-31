import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_ACCESS_SECRET

export const jwtService = {

    async generateJwtToken(login: string, email: string): Promise<string> {
        const payload = { login, email }
        if (!secret) {
            throw new Error('JWT secret is not defined');
        }
        return jwt.sign(payload, secret, {expiresIn: '1h'})
    },

    async getUserByToken(token: string) {
        try {
            if (!secret) {
                throw new Error('JWT secret is not defined');
            }
            const decoded: any = jwt.verify(token, secret)
            return decoded; // возвращаем объект пользователя
        } catch (error) {
            return null
        }
    }
}