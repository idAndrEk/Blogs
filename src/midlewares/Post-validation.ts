import {body} from "express-validator";

export const PostValidation = [
    body('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 30, min: 1}) //30
        .withMessage('incorrect title'),
    body('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 100, min: 1})
        .withMessage('incorrect shortDescription'),
    body('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 1000, min: 1})
        .withMessage('incorrect content'),
]