// import {Request, Response, Router} from "express";
// import {authBasicMiddleware} from "../../midlewares/auth/authMiddleware";
// import {PostInputType, PostListResponse} from "../../types/PostType";
// import {BlogsQueryRepository} from "../../repositories/blogs/blogsQueryRepository";
// import {postsService} from "../../domain/posts/posts-service";
// import {PostsQueryRepository} from "../../repositories/posts/postsQueryRepository";
// import {inputValidationMiddleware, validateObjectIdMiddleware} from "../../midlewares/input-validation-middleware";
// import {PostValidation} from "../../validators/postValidation";
// import {parseQueryParams, SortDirection} from "../../utils/queryParamsParser";
//
//
// export const commentsRouter = Router({})
//
// // Обработка ошибок
// const handleErrors = (res: Response, error: any) => {
//     console.error("Error:", error);
//     res.status(500).json({error: "Internal Server Error"});
// };
//
// commentsRouter.get('/:id',
//     validateObjectIdMiddleware,
//     async (req: Request, res: Response) => {
//         try {
//             let comment = await PostsQueryRepository.findPostById(req.params.id)
//             if (post) {
//                 res.status(200).send(post)
//                 return
//             }
//             res.sendStatus(404)
//             return
//         } catch (error) {
//             handleErrors(res, error);
//             return
//         }
//     })
//
//
// commentsRouter.put('/:id',
//     validateObjectIdMiddleware,
//     // authBasicMiddleware,
//     // PostValidation,
//     inputValidationMiddleware,
//     async (req: Request, res: Response) => {
//         try {
//             const postId = req.params.id;
//             const post = await PostsQueryRepository.findPostById(postId);
//             if (!post) {
//                 res.status(404).json({error: 'Post not found'});
//                 return
//             }
//             const {title, shortDescription, content, blogId} = req.body;
//             const blogById = await BlogsQueryRepository.findBlogById(blogId);
//             if (blogById) {
//                 const isUpdated = await postsService.updatePost(postId, blogById?.name, {
//                     title,
//                     shortDescription,
//                     content,
//                     blogId
//                 });
//                 if (isUpdated) {
//                     return res.sendStatus(204)
//
//                 }
//                 return res.sendStatus(404)
//
//             }
//         } catch (error) {
//             return handleErrors(res, error)
//
//         }
//     })
//
// commentsRouter.delete('/:id',
//     validateObjectIdMiddleware,
//     authBasicMiddleware,
//     async (req: Request, res: Response) => {
//         try {
//             const isDeleted = await postsService.deletePost(req.params.id)
//             if (isDeleted) {
//                 res.sendStatus(204);
//                 return
//             } else {
//                 res.status(404).json({error: 'Post not found'});
//                 return
//             }
//         } catch (error) {
//             handleErrors(res, error);
//             return
//         }
//     })
//
