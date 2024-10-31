import {NextFunction, raw, Request, Response} from "express"
import {jwtService} from "../../application/jwt-service";
import {UsersQueryRepository} from "../../repositories/users/usersQueryRepository";

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    const encode = `Basic ${base64}`;
    if (authHeader === encode) {
        next()
    } else {
        res.status(401).send('Access denied')
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    console.log('token: ', token)
    if (!token) {
        return res.status(401).json({message: 'Token not provided'})
    }
    try {
        const decodedToken = await jwtService.getUserByToken(token);
        console.log('decodedToken: ',decodedToken)
        // Если токен неверный или просрочен
        if (!decodedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = await UsersQueryRepository.findCheckUserByLogin(decodedToken.login);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid token'});
    }
    return
}


