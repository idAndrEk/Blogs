import {Request, Response, Router} from "express";
import {UsersQueryRepository} from "../../repositories/users/usersQueryRepository";
import {jwtService} from "../../application/jwt-service";
import {authMiddleware} from "../../midlewares/auth/authMiddleware";

export const authRouter = Router({})
const bcrypt = require('bcrypt')

// errors
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

authRouter.post('/login',
    async (req: Request, res: Response) => {
        try {
            const {loginOrEmail, password} = req.body
            const user = await UsersQueryRepository.findCheckUserByLogin(loginOrEmail)
            console.log(user)
            if (!user) return res.sendStatus(401)
            const isValidPassword = await bcrypt.compare(password, user.passwordHash)
            if (!isValidPassword) return res.sendStatus(401)
            const accessToken = await jwtService.generateJwtToken(user.login, user.email)
            return res.status(200).json({accessToken});
        } catch (error) {
            return handleErrors(res, error)
        }
    })

authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            if (! (req as any).user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            return res.status(200).json({
                email:  (req as any).user.email,
                login:  (req as any).user.login,
                userId:  (req as any).user.id
            });
        } catch (error) {
            return handleErrors(res, error)
        }
    });


