import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-db-repository";
import validateObjectIdMiddleware, {inputValidationMiddleware} from "../midlewares/input-validation-middleware";
import {authBasicMiddleware} from "../midlewares/auth-middleware";
import {BlogInputType, BlogViewType} from "../types/BlogType";
import {BlogValidation} from "../midlewares/Blog-validation";
import {log} from "util";


export const blogsRouter = Router({})

// Обработка ошибок
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

blogsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const foundBlogs: BlogViewType[] = await blogsRepository.findBlog(req.query.name?.toString())
            res.status(200).send(foundBlogs)
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

blogsRouter.get('/:id',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            let blog = await blogsRepository.findBlogById(req.params.id)
            if (blog) {
                res.send(blog)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

blogsRouter.post('/',
    authBasicMiddleware,
    BlogValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {name, description, websiteUrl} = req.body;
            const newBlog: BlogInputType = await blogsRepository.createBlog({name, description, websiteUrl})
            res.status(201).send(newBlog)
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

blogsRouter.put('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    BlogValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {name, description, websiteUrl} = req.body;
            const isUpdated = await blogsRepository.updateBlog(req.params.id, {name, description, websiteUrl})
            if (isUpdated) {
                const blog = await blogsRepository.findBlogById(req.params.id)
                res.status(204).send(blog)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

blogsRouter.delete('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const isDeleted = await blogsRepository.deleteBlog(req.params.id)
            if (isDeleted) {
                res.sendStatus(204)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

