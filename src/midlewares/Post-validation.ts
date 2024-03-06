import {body} from "express-validator";
import {blogsRepository} from "../repositories/blogs-db-repository";

export const PostValidation = [
    body('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 1, min: 1}) //30
        .withMessage('incorrect title'),
    body('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 1, min: 1})//100
        .withMessage('incorrect shortDescription'),
    body('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 1000, min: 1})
        .withMessage('incorrect content'),
    body('blogId')
        .custom(async (blogId) => {
            const blogById = await blogsRepository.findBlogValidationById(blogId);
            if (!blogById) {
                throw new Error('incorrect blogId');
            }
        }),
]