import {Request, Response, Router} from "express";
import {authBasicMiddleware} from "../../midlewares/auth/authMiddleware";
import {PostInputType, PostListResponse} from "../../types/PostType";
import {BlogsQueryRepository} from "../../repositories/blogs/blogsQueryRepository";
import {postsService} from "../../domain/posts/posts-service";
import {PostsQueryRepository} from "../../repositories/posts/postsQueryRepository";
import {inputValidationMiddleware, validateObjectIdMiddleware} from "../../midlewares/input-validation-middleware";
import {PostValidation} from "../../validators/postValidation";
import {parseQueryParams, SortDirection} from "../../utils/queryParamsParser";
import {CommentValidation} from "../../validators/commentValidation";
import {commentsService} from "../../domain/comments/comments-service";


export const postsRouter = Router({})

// Обработка ошибок
const handleErrors = (res: Response, error: any) => {
    console.error("Error:", error);
    res.status(500).json({error: "Internal Server Error"});
};

postsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const {sortBy, sortDirection, parsedPageNumber, parsedPageSize} = parseQueryParams(req)
            const queryTitle = req.query.title?.toString()
            const foundPosts: PostListResponse = await PostsQueryRepository.findPost(+parsedPageNumber, +parsedPageSize, queryTitle, sortBy.toString(), sortDirection)
            res.status(200).send(foundPosts)
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

postsRouter.get('/:id',
    validateObjectIdMiddleware,
    async (req: Request, res: Response) => {
        try {
            let post = await PostsQueryRepository.findPostById(req.params.id)
            if (post) {
                res.status(200).send(post)
                return
            }
            res.sendStatus(404)
            return
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

postsRouter.post('/',
    authBasicMiddleware,
    PostValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        try {
            const {title, shortDescription, content, blogId} = req.body;
            const errors = [];
            const blogById = await BlogsQueryRepository.findBlogById(blogId);
            if (!blogById || !blogById.id) {
                // errors.push({message: 'incorrect blogId', field: 'blogId'})
                errors.push({message: 'Error blogId', field: 'blogId'})
            }
            if (errors.length > 0) {
                return res.status(400).json({errorsMessages: errors});
            }
            const newPost: PostInputType | null = await postsService.createPost(
                blogById?.id as string,
                blogById?.name as string,
                {
                    title, shortDescription, content, blogId
                });
            if (newPost) {
                return res.status(201).send(newPost);
            } else {
                return res.sendStatus(404);
            }
        } catch (error) {
            handleErrors(res, error);
            return
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
            const post = await PostsQueryRepository.findPostById(postId);
            if (!post) {
                res.status(404).json({error: 'Post not found'});
                return
            }
            const {title, shortDescription, content, blogId} = req.body;
            const blogById = await BlogsQueryRepository.findBlogById(blogId);
            if (blogById) {
                const isUpdated = await postsService.updatePost(postId, blogById?.name, {
                    title,
                    shortDescription,
                    content,
                    blogId
                });
                if (isUpdated) {
                    return res.sendStatus(204)

                }
                return res.sendStatus(404)

            }
        } catch (error) {
            return handleErrors(res, error)

        }
    })

postsRouter.delete('/:id',
    validateObjectIdMiddleware,
    authBasicMiddleware,
    async (req: Request, res: Response) => {
        try {
            const isDeleted = await postsService.deletePost(req.params.id)
            if (isDeleted) {
                return res.sendStatus(204);

            }
            return res.status(404).json({error: 'Post not found'});
        } catch (error) {
            handleErrors(res, error);
            return
        }
    })

//comments

// postsRouter.post('/:id/comments',
//     CommentValidation,
//     async (req: Request, res: Response) => {
//         try {
//             const content = req.body
//             const postId = req.params.id
//             const postById = PostsQueryRepository.findPostById(postId)
//             if (!postById) {
//                 return res.sendStatus(404)
//             }
//             const newComment = await commentsService.createComments(postId, content)
//             if (newComment) {
//                 return res.status(201).send(newComment);
//             }
//             return res.sendStatus(404);
//         } catch (error) {
//             return handleErrors(res, error);
//         }
//     })
