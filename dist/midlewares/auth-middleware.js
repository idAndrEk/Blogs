"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authBasicMiddleware = void 0;
const auth = { login: 'admin', password: 'qwerty' };
const authBasicMiddleware = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }
    res.status(401).send('Authentication required');
};
exports.authBasicMiddleware = authBasicMiddleware;
