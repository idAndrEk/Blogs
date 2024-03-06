import {body} from "express-validator";

export const BlogValidation = [
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 15, min: 1}) //15
        .withMessage('incorrect name'),
    body('description')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 500, min: 1})
        .withMessage('incorrect description'),
    body('websiteUrl')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 100, min: 1})
        .matches('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
        .withMessage('incorrect websiteUrl')
]