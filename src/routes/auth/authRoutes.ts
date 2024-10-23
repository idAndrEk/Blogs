import {Request, Response, Router} from "express";
import {authService} from "../../domain/auth/authService";

export const authRouter = Router({})

// errors
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

authRouter.post('/login',
    async (req: Request, res: Response) => {
        try {
            const {loginOrEmail, password} = req.body
            const isValid = await authService.checkCredentials(loginOrEmail, password)
            if (isValid) {
                return res.sendStatus(204)
            }
            return res.sendStatus(401)
        } catch (error) {
            return handleErrors(res, error)
        }
    })


