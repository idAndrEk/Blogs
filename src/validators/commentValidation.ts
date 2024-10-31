import {body} from "express-validator";

export const CommentValidation = [
    body('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 300, min: 20}) //30
        .withMessage('incorrect content'),
]