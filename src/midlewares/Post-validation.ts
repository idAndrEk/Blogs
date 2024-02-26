import {body} from "express-validator";

export const PostValidation = [
    body('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 30, min: 1})
        .withMessage('Error title'),
    body('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 100, min: 1})
        .withMessage('Error shortDescription'),
    body('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 1000, min: 1})
        .withMessage('Error content'),
    body('blogId')
        .notEmpty()
        .isString()
        .trim()
        .withMessage('Error blogId')
]