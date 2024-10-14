import {Request, Response, Router} from "express";
import validateObjectIdMiddleware, {inputValidationMiddleware} from "../midlewares/input-validation-middleware";
import {authBasicMiddleware} from "../midlewares/auth-middleware";
import {BlogInputType, BlogListResponse, BlogViewType} from "../types/BlogType";
import {BlogValidation} from "../midlewares/Blog-validation";
import {blogsService} from "../domain/blogs-service";
import {BlogsQueryRepository} from "../repositories/blogs/blogsQueryRepository";
import {PostInputType} from "../types/PostType";
import {postsService} from "../domain/posts-service";
import {PostValidation} from "../midlewares/Post-validation";
import {SortBy, SortDirection} from "../types/paginationType";
import {PostsQueryRepository} from "../repositories/posts/postsQueryRepository";


export const blogsRouter = Router({})

// Обработка ошибок
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

blogsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const parsedPageNumber = req.query.pageNumber || 1;
            const parsedPageSize = req.query.pageSize || 10;
            const searchNameTerm = req.query.searchNameTerm || '';
            const sortBy: SortBy = req.query.sortBy as SortBy || SortBy.CreatedAt;
            const sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc;
            const blogsListResponse: BlogListResponse = await BlogsQueryRepository.findBlog(
                +parsedPageNumber,
                +parsedPageSize,
                searchNameTerm.toString(),
                sortBy.toString(),
                sortDirection
            );
            res.status(200).send(blogsListResponse)
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

blogsRouter.get('/:id',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            let getBlogById = await BlogsQueryRepository.findBlogById(req.params.id)
            if (getBlogById) {
                res.send(getBlogById)
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
            const newBlog: BlogInputType = await blogsService.createBlog({name, description, websiteUrl})
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
            const updateBlogById = await blogsService.updateBlog(req.params.id, {name, description, websiteUrl})
            if (updateBlogById) {
                const blog = await BlogsQueryRepository.findBlogById(req.params.id)
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
            const deleteBlogById = await blogsService.deleteBlog(req.params.id)
            if (deleteBlogById) {
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

blogsRouter.get('/:id/posts',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const parsedPageNumber = req.query.pageNumber || 1;
            const parsedPageSize = req.query.pageSize || 10;
            const sortBy: SortBy = req.query.sortBy as SortBy || SortBy.CreatedAt;
            const sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc;
            let blogById = await BlogsQueryRepository.findBlogById(req.params.id)
            if (!blogById) {
                res.sendStatus(404)
                return
            }
            const postsByBlogId = await PostsQueryRepository.findPostBlogById(blogById.id as string, +parsedPageNumber, +parsedPageSize, sortBy, sortDirection)
            if (postsByBlogId) {
                res.send(postsByBlogId)
                return
            }
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

blogsRouter.post('/:id/posts',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content} = req.body;
            const blogId = req.params.id
            const blogById = await BlogsQueryRepository.findBlogById(blogId)
            if (!blogById || !blogById.id) {
                res.sendStatus(404)
                return;
            }
            const createPostBlogger: PostInputType | null = await postsService.createPost(blogById?.id, blogById?.name, {
                title,
                shortDescription,
                content,
                blogId
            });
            if (createPostBlogger) {
                res.status(201).send(createPostBlogger);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

