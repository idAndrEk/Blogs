import {Request, Response, Router} from "express";
import validateObjectIdMiddleware, {inputValidationMiddleware} from "../midlewares/input-validation-middleware";
import {authBasicMiddleware} from "../midlewares/auth-middleware";
import {postsRepository} from "../repositories/posts-db-repository";
import {PostInputType, PostViewType} from "../types/PostType";
import {PostValidation} from "../midlewares/Post-validation";


export const postsRouter = Router({})

postsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const foundPosts: PostViewType[] = await postsRepository.findPost(req.query.title?.toString())
            res.status(200).send(foundPosts)
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    })

postsRouter.get('/:id',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            let post = await postsRepository.findPostById(req.params.id)
            if (post) {
                res.send(post)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            console.error("Error fetching blog by ID:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    })

postsRouter.post('/',
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content, blogId} = req.body;
            const newPost: PostInputType | null = await postsRepository.createPost({title, shortDescription, content, blogId})
            // if (!newPost) {
            //     const errors = [];
            //     errors.push({message: 'Error bloggerId', field: 'bloggerId'})
            //     if (errors.length) {
            //         res.status(400).json({
            //             errorsMessages: errors
            //         })
            //         return
            //     }
            // }
            // res.status(201).send(newPost)
            const errors = [];
            errors.push({ message: 'Error bloggerId', field: 'bloggerId' });

            if (!newPost && errors.length) {
                res.status(400).json({
                    errorsMessages: errors
                })
                return;
            }
            res.status(201).send(newPost)
        } catch (error) {
            console.error("Error creating blog:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    })

postsRouter.put('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content, blogId} = req.body;
            const isUpdated = await postsRepository.updatePost(req.params.id, {
                title,
                shortDescription,
                content,
                blogId
            })
            if (isUpdated) {
                const post = await postsRepository.findPostById(req.params.id)
                if (post) {
                    res.status(204).send(post);
                } else {
                    res.sendStatus(404);
                }
                return;
            }
            const errors = [];
            errors.push({message: 'Error bloggerId', field: 'bloggerId'})
            if (errors.length) {
                res.status(400).json({
                    errorsMessages: errors
                })
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            console.error("Error updating blog:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    })

postsRouter.delete('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const isDeleted = await postsRepository.deletePost(req.params.id)
            if (isDeleted) {
                res.sendStatus(204)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            console.error("Error deleting blog:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    })

