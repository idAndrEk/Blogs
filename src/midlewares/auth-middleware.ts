import {NextFunction, Request, Response} from "express";

// const auth = {login: 'admin', password: 'qwerty'}
//
// export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
//     const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
//     if (login && password && login === auth.login && password === auth.password
//     ) {
//         return next()
//     }
//     res.status(401).send('Authentication required')
// }

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    console.log(base64)
    const encode = `Basic ${base64}`;
    if (authHeader === encode) {
        next()
    } else {
        res.status(401).send('Access denied')
    }
}