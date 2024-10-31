import {body} from "express-validator";
import {UsersQueryRepository} from "../repositories/users/usersQueryRepository";

export const UserValidation = [
    body('login')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 10})
        .matches(/^[a-zA-Z0-9_-]*$/)
        .custom(async (login) => {
            const userExists = await UsersQueryRepository.findUserByLogin(login);
            if (userExists) {
                throw new Error('incorrect login');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 6, max: 20}),
    body('email')
        .notEmpty()
        .isEmail()
        .custom(async (email) => {
            const emailExists = await UsersQueryRepository.findUserByEmail(email);
            if (emailExists) {
                throw new Error('incorrect email');
            }
            return true;
        }),
]
