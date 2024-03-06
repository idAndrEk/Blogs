import {Request, Response, Router} from "express";
import validateObjectIdMiddleware, {inputValidationMiddleware} from "../midlewares/input-validation-middleware";
import {authBasicMiddleware} from "../midlewares/auth-middleware";
import {postsRepository} from "../repositories/posts-db-repository";
import {PostInputType, PostViewType} from "../types/PostType";
import {PostValidation} from "../midlewares/Post-validation";
import {blogsRepository} from "../repositories/blogs-db-repository";


export const postsRouter = Router({})

// Обработка ошибок
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

postsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const foundPosts: PostViewType[] = await postsRepository.findPost(req.query.title?.toString())
            res.status(200).send(foundPosts)
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.get('/:id',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            let post = await postsRepository.findPostById(req.params.id)
            if (post) {
                res.status(200).send(post)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.post('/',
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content, blogId} = req.body;
            const blogById = await blogsRepository.findBlogById(blogId);
            if (!blogById || !blogById.id) {
                res.sendStatus(400)
                return;
            }
            const newPost: PostInputType | null = await postsRepository.createPost(blogById?.id, blogById?.name, {
                title,
                shortDescription,
                content,
                blogId
            });
            if (newPost) {
                res.status(201).send(newPost);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.put('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            const post = await postsRepository.findPostById(postId);
            if (!post) {
                res.status(404).json({error: 'Post not found'});
            }
            const {title, shortDescription, content, blogId} = req.body;
            const blogById = await blogsRepository.findBlogById(blogId);
            if (blogById) {
                const isUpdated = await postsRepository.updatePost(postId, blogById?.name, {
                    title,
                    shortDescription,
                    content,
                    blogId
                });
                if (isUpdated) {
                    res.sendStatus(204)
                    return
                }
                res.sendStatus(404)
                return
            }
                // if (!blogById) {
            //     res.status(400).json({errorsMessages: [{message: 'Error blogId', field: 'blogId'}]});
            //     return;
            // }
            // const isUpdated = await postsRepository.updatePost(postId, blogById?.name, {title, shortDescription, content, blogId});
            // if (isUpdated) {
            //     res.status(204).send(post);
            // } else {
            //     res.status(500).json({error: 'Internal Server Error'});
            // }
            // const {title, shortDescription, content, blogId} = req.body;
            // const postId = req.params.id;
            // const isUpdated = await postsRepository.updatePost(postId, {
            //     title,
            //     shortDescription,
            //     content,
            //     blogId
            // })
            //
            // if (isUpdated) {
            //     const post = await postsRepository.findPostById(postId);
            //
            //     if (post) {
            //         res.status(204).send(post);
            //     } else {
            //         res.status(404).json({error: 'Post not found'});
            //     }
            // } else {
            //     const errors = [];
            //     errors.push({message: 'Error blogId', field: 'blogId'});
            //
            //     if (errors.length) {
            //         res.status(400).json({
            //             errorsMessages: errors
            //         });
            //     } else {
            //         res.sendStatus(404);
            //     }
        } catch (error) {
            handleErrors(res, error);
        }
    })

postsRouter.delete('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const isDeleted = await postsRepository.deletePost(req.params.id)
            if (isDeleted) {
                res.sendStatus(204);
                return
            } else {
                res.status(404).json({error: 'Post not found'});
                return
            }
        } catch (error) {
            handleErrors(res, error);
        }
    })

