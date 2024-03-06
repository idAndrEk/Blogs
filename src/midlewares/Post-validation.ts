import {body} from "express-validator";

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
    // body('blogId')
    //     .custom(async (value, { req }) => {
    //         const blogById = await blogsRepository.findBlogById(value);
    //         if (!blogById || !blogById.id) {
    //             throw new Error('incorrect blogId');
    //         }
    //         req.blogId = blogById.id
    //     }),
]