import {Request, Response, Router} from "express";
import {authBasicMiddleware} from "../../midlewares/auth/authMiddleware";
import {BlogInputType, BlogListResponse} from "../../types/BlogType";
import {blogsService} from "../../domain/blogs/blogs-service";
import {BlogsQueryRepository} from "../../repositories/blogs/blogsQueryRepository";
import {PostInputType} from "../../types/PostType";
import {postsService} from "../../domain/posts/posts-service";
import {PostsQueryRepository} from "../../repositories/posts/postsQueryRepository";
import {inputValidationMiddleware, validateObjectIdMiddleware} from "../../midlewares/input-validation-middleware";
import {BlogValidation} from "../../validators/blogValidation";
import {PostValidation} from "../../validators/postValidation";
import {parseQueryParams} from "../../utils/queryParamsParser";
import {PostBlogByIdValidation} from "../../validators/PostBlogByIdValidation";


export const blogsRouter = Router({})

// errors
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

blogsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const {sortBy, sortDirection, parsedPageNumber, parsedPageSize} = parseQueryParams(req)
            const searchNameTerm = req.query.searchNameTerm || '';
            const blogsListResponse: BlogListResponse = await BlogsQueryRepository.findBlog(
                +parsedPageNumber,
                +parsedPageSize,
                searchNameTerm.toString(),
                sortBy.toString(),
                sortDirection
            );
            return res.status(200).send(blogsListResponse)
        } catch (error) {
            return handleErrors(res, error);
        }
    })

blogsRouter.get('/:id',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            let getBlogById = await BlogsQueryRepository.findBlogById(req.params.id)
            if (getBlogById) {
                return res.send(getBlogById)
            }
            return res.sendStatus(404)
        } catch (error) {
            return handleErrors(res, error);
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
            return res.status(201).send(newBlog)
        } catch (error) {
            return handleErrors(res, error);
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
                return res.status(204).send(blog)
            }
            return res.sendStatus(404)
        } catch (error) {
            return handleErrors(res, error);
        }
    })

blogsRouter.delete('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const deleteBlogById = await blogsService.deleteBlog(req.params.id)
            if (deleteBlogById) {
                return res.sendStatus(204)
            }
            return res.sendStatus(404)
        } catch (error) {
            return handleErrors(res, error);
        }
    })

//posts
blogsRouter.get('/:id/posts',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {sortBy, sortDirection, parsedPageNumber, parsedPageSize} = parseQueryParams(req)
            let blogById = await BlogsQueryRepository.findBlogById(req.params.id)
            if (!blogById) {
                return res.sendStatus(404)
            }
            const postsByBlogId = await PostsQueryRepository.findPostBlogById(
                blogById.id as string,
                +parsedPageNumber,
                +parsedPageSize,
                sortBy.toString(),
                sortDirection)
            if (postsByBlogId) {
                return res.send(postsByBlogId)
            }
        } catch (error) {
            return handleErrors(res, error);
        }
    })

blogsRouter.post('/:id/posts',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    PostBlogByIdValidation, //???
    // PostValidation, //???
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content} = req.body;
            const blogId = req.params.id
            const blogById = await BlogsQueryRepository.findBlogById(blogId)
            if (!blogById || !blogById.id) {
                return res.sendStatus(404)
            }
            const createPostBlogger: PostInputType | null = await postsService.createPost(blogById?.id, blogById?.name, {
                title,
                shortDescription,
                content,
                blogId
            })
            if (createPostBlogger) {
                res.status(201).send(createPostBlogger);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            return handleErrors(res, error);
        }
    })

